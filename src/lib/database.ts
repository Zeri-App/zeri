import Dexie from 'dexie';
import type { Album, Artist, Playlist, Track } from '@app/types';

class Database extends Dexie {
  tracks: Dexie.Table<Track, number>;
  albums: Dexie.Table<Album, number>;
  artists: Dexie.Table<Artist, number>;
  playlists: Dexie.Table<Playlist, number>;

  constructor(dbName: string) {
    super(dbName);

    this.version(1).stores({
      songs: '++id, source, title, artist, album, album_art, added, liked',
      albums: '++id, title, artist, album_art',
      artists: '++id, name',
      playlists: '++id, name'
    });

    this.tracks = this.table('songs');
    this.albums = this.table('albums');
    this.artists = this.table('artists');
    this.playlists = this.table('playlists');
  }

  exists = async (track: Track): Promise<Track | undefined> =>
    await this.tracks
      .where('source')
      .equals(track.source)
      .and((t) => t.title === track.title)
      .first();

  getAllTracks = async (): Promise<Playlist> => {
    let allTracks: Playlist | undefined = await this.playlists
      .where('name')
      .equals('Tracks')
      .first();
    if (!allTracks) {
      const tracks = await this.tracks.toArray();
      allTracks = {
        id: 0,
        name: 'Tracks',
        tracks: tracks.map((track) => track.id)
      } as Playlist;
      allTracks.id = await this.playlists.add(allTracks);
    }
    return allTracks;
  };

  getLikedTracks = async (): Promise<Playlist> => {
    let likedTracks: Playlist | undefined = await this.playlists
      .where('name')
      .equals('Liked')
      .first();
    if (!likedTracks) {
      likedTracks = {
        id: 1,
        name: 'Liked',
        tracks: []
      } as Playlist;
      likedTracks.id = await this.playlists.add(likedTracks);
    }
    return likedTracks;
  };

  getTrack = async (trackId: number): Promise<Track | undefined> =>
    await this.tracks.where('id').equals(trackId).first();

  getPlaylist = async (playlistId: number): Promise<Playlist | undefined> =>
    await this.playlists.where('id').equals(playlistId).first();

  getAlbum = async (title: string): Promise<Album | undefined> =>
    await this.albums.where('title').equals(title).first();

  getArtist = async (name: string): Promise<Artist | undefined> =>
    await this.artists.where('name').equals(name).first();

  getAlbumTracks = async (albumId: number): Promise<Track[]> => {
    const album = await this.albums.get(albumId);
    if (album) {
      const tracks = await this.tracks.where('id').anyOf(album.tracks).toArray();
      return tracks;
    }
    return [];
  };

  getArtistTracks = async (artistId: number): Promise<Track[]> => {
    const artist = await this.artists.get(artistId);
    if (artist) {
      const tracks = await this.tracks.where('id').anyOf(artist.tracks).toArray();
      return tracks;
    }
    return [];
  };

  addTrackToPlaylist = async (playlist: number, track: number) => {
    const list: Playlist | undefined = await this.playlists.where('id').equals(playlist).first();
    if (!list || list.tracks.includes(track)) return;

    list.tracks.push(track);
    await this.playlists.update(playlist, list);
  };

  addTrackToLikedPlaylist = async (track: number) => {
    const list: Playlist | undefined = await this.playlists.where('id').equals(1).first();
    if (!list || list.tracks.includes(track)) return;
    list.tracks.push(track);
    await this.playlists.update(1, list!);

    const likedTrack: Track | undefined = await this.tracks.get(track);

    if (likedTrack) {
      likedTrack.liked = true;
      await this.tracks.update(track, likedTrack);
    }
  };

  removeTrackFromLikedPlaylist = async (track: number): Promise<void> => {
    const likedPlaylist = await this.playlists.where('id').equals(1).first();
    if (likedPlaylist) {
      const index = likedPlaylist.tracks.indexOf(track);
      if (index !== -1) {
        likedPlaylist.tracks.splice(index, 1);
        await this.playlists.update(1, likedPlaylist);

        const likedTrack: Track | undefined = await this.tracks.get(track);

        if (likedTrack) {
          likedTrack.liked = false;
          await this.tracks.update(track, likedTrack);
        }
      }
    }
  };

  addTrack = async (track: Track): Promise<void> => {
    if (!track) return;

    await this.transaction(
      'rw',
      this.tracks,
      this.playlists,
      this.albums,
      this.artists,
      async (): Promise<void> => {
        const existingTrack = await this.exists(track);
        if (existingTrack) {
          track = existingTrack;
        } else {
          track.title = track.title || track.source.split('/').pop()?.replace(/\.mp3/, '') || '';
          track.artist = track.artist.split(/[\u0000/]/)[0] || 'Unknown Artist';
          track.album = track.album || 'Unkown Album';
          track.album_art = track.album_art || '';
          track.year = track.year.split('-')[0] || 'Unkown Year';
          track.album_track = track.album_track || '';
          track.added = new Date();
          track.liked = false;

          track.id = await this.tracks.add(track);

          await this.addTrackToArtist(track);
          await this.addTrackToAlbum(track);
        }
        await this.addTrackToPlaylist(0, track.id);
      }
    );
  };

  addSourceFolder = async (tracks: Track[], progress?: (progress: number) => void) => {
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (!track) continue;
      await this.addTrack(track);
      progress?.(i + 1);
    }
  };

  addPlaylist = async (name: string): Promise<void> => {
    if (await this.playlists.where('name').equals(name).first()) return;
    await this.playlists.add({ name, tracks: [] } as unknown as Playlist);
  };

  addTrackToAlbum = async (track: Track): Promise<void> => {
    const existingAlbum = await this.albums.where('title').equals(track.album).first();

    if (existingAlbum) {
      if (!existingAlbum.tracks.includes(track.id)) {
        existingAlbum.tracks.push(track.id);
        await this.albums.update(existingAlbum.id, existingAlbum);
      }
    } else {
      await this.albums.add({
        title: track.album,
        artist: track.artist,
        album_art: track.album_art,
        tracks: [track.id]
      } as Album);
    }
  };

  addTrackToArtist = async (track: Track): Promise<void> => {
    const existingArtist = await this.artists.where('name').equals(track.artist).first();

    if (existingArtist) {
      if (!existingArtist.tracks.includes(track.id)) {
        existingArtist.tracks.push(track.id);
        await this.artists.update(existingArtist.id, existingArtist);
      }
    } else {
      await this.artists.add({
        name: track.artist,
        tracks: [track.id]
      } as Artist);
    }
  };

  updateTrack = async (track: Track): Promise<void> => {
    // TODO - UPDATE TRACK METADATA
    await this.tracks.update(track.id, track);
  };

  deleteTrack = async (trackId: number): Promise<void> => {
    await this.tracks.delete(trackId);
  };

  deletePlaylist = async (playlistId: number): Promise<void> => {
    await this.playlists.delete(playlistId);
  };

  getRecentlyAddedTracks = async (limit: number): Promise<Track[]> => {
    const tracks = await this.tracks.orderBy('added').reverse().limit(limit).toArray();
    return tracks;
  };

  searchTracks = async (query: string): Promise<Track[]> => {
    const tracks = await this.tracks
      .filter((track: Track) => {
        const isTitleMatch = track.title.toLowerCase().startsWith(query.toLowerCase());
        const isArtistMatch = track.artist.toLowerCase().includes(query.toLowerCase());
        const artistName = track.artist.toLowerCase().replace(/\s/g, '');
        const queryParts = query.toLowerCase().split(/\s+/);
        const isArtistPartialMatch = queryParts.every((part) => artistName.includes(part));
        const separatedTitle = track.title.toLowerCase().replace(/\s/g, '');
        const separatedQuery = query.toLowerCase().replace(/\s/g, '');
        const isTitleSeparationMatch = separatedTitle.includes(separatedQuery);

        return isTitleMatch || isArtistMatch || isArtistPartialMatch || isTitleSeparationMatch;
      })
      .toArray();
    return tracks;
  };
}

export default new Database('zeri-db');
