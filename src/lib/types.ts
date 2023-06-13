import type { LocalKeys } from '@app/constants';

export type Option<T> = T | null;

export type Keys = LocalKeys;

export interface Track {
  id: number;
  source: string;
  title: string;
  artist: string;
  album: string;
  album_track?: string | undefined;
  album_art: string;
  duration: number;
  genre?: string | undefined;
  year: string;
  lyrics: Array<{
    text?: string | undefined;
    description?: string | undefined;
    lang?: string | undefined;
  }>;
  added: Date;
  liked: boolean;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  album_art: string;
  tracks: number[];
}

export interface Artist {
  id: number;
  name: string;
  tracks: number[];
}

export interface Playlist {
  id: number;
  name: string;
  tracks: number[];
}
