<script lang="ts">
  import { TauriEvent } from '@tauri-apps/api/event';
  import { appWindow } from '@tauri-apps/api/window';
  import { convertFileSrc } from '@tauri-apps/api/tauri';
  import { onDestroy, onMount } from 'svelte';
  import { OverlayScrollbarsComponent as ScrollView } from 'overlayscrollbars-svelte';

  import AppBar from '@app/components/window/AppBar.svelte';
  import {
    AUDIO_ELEMENT,
    CURRENT_PLAYING_TRACK,
    CURRENT_PLAYING_TRACK_DURATION,
    CURRENT_PLAYING_TRACK_ID,
    CURRENT_PLAYING_TRACK_TIME,
    CURRENT_PLAYLIST_ID,
    CURRENT_PLAYLIST_TRACKS,
    CURRENT_QUEUE_IDS,
    PLAYER_PAUSED,
    PLAYER_VOLUME,
    REPEAT_MODE,
    SHUFFLE_ON
  } from '@app/stores/playerStore';
  import { windowFocused, windowMaximized } from '@app/stores/windowStore';
  import { useWindowEvent } from '@app/composables/useWindowEvent';
  import { useLocalStorage } from '@app/composables/useLocalStorage';
  import { useTauriEvent } from '@app/composables/useTauriEvent';
  import { next, previous, togglePlay } from '@app/controls';
  import database from '@app/database';
  import { LocalKeys } from '@app/constants';

  import AppPlayer from '@app/components/window/AppPlayer.svelte';
  import AppSideBar from '@app/components/window/AppSideBar.svelte';
  import { liveQuery, type Observable, type Subscription } from 'dexie';
  import { get } from 'svelte/store';

  let cleanUpWindowResized: () => void;
  let cleanUpWindowBlur: () => void;
  let cleanUpWindowFocus: () => void;
  let cleanUpKeyDown: () => void;
  let cleanUpCurrentPlayingTrackId: () => void;
  let countTracks: Observable<number> = liveQuery(
    async (): Promise<number> => await database.tracks.count()
  );
  let cleanUpCountTracks: Subscription;

  const onWindowResized = async () => {
    windowMaximized.set(await appWindow.isMaximized());
  };

  onMount(() => {
    database.getAllTracks();
    database.getLikedTracks();

    CURRENT_QUEUE_IDS.set(
      JSON.parse(useLocalStorage('get', LocalKeys.CURRENT_QUEUE_IDS) || '[]') as number[]
    );

    cleanUpWindowResized = useTauriEvent(TauriEvent.WINDOW_RESIZED, onWindowResized);
    cleanUpWindowBlur = useTauriEvent(TauriEvent.WINDOW_BLUR, () => windowFocused.set(false));
    cleanUpWindowFocus = useTauriEvent(TauriEvent.WINDOW_FOCUS, () => windowFocused.set(true));

    cleanUpKeyDown = useWindowEvent('keydown', (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.key) {
        case 'Tab':
          break;
        case ' ':
          togglePlay();
          break;
        case 'ArrowDown':
          if ($PLAYER_VOLUME > 0) $PLAYER_VOLUME = Number(($PLAYER_VOLUME - 0.1).toFixed(1));
          break;
        case 'ArrowUp':
          if ($PLAYER_VOLUME < 1) $PLAYER_VOLUME = Number(($PLAYER_VOLUME + 0.1).toFixed(1));
          break;
        case 'ArrowLeft':
          previous();
          break;
        case 'ArrowRight':
          next();
          break;
        default:
          return;
      }
    });

    cleanUpCurrentPlayingTrackId = CURRENT_PLAYING_TRACK_ID.subscribe(
      async (trackId: number): Promise<void> => {
        useLocalStorage('set', LocalKeys.CURRENT_PLAYING_TRACK_ID, String(trackId));
        CURRENT_PLAYING_TRACK.set(await database.getTrack(trackId));
      }
    );

    cleanUpCountTracks = countTracks.subscribe(() => populatePlaylistTracks());

    navigator.mediaSession.setActionHandler('previoustrack', previous);
    navigator.mediaSession.setActionHandler('nexttrack', next);
  });

  onDestroy(() => {
    cleanUpWindowResized?.();
    cleanUpWindowBlur?.();
    cleanUpWindowFocus?.();

    cleanUpKeyDown?.();

    cleanUpCurrentPlayingTrackId?.();
    cleanUpCountTracks?.unsubscribe();
  });

  const populatePlaylistTracks: () => Promise<void> = async (): Promise<void> => {
    let playlist = await database.getPlaylist($CURRENT_PLAYLIST_ID);
    if (playlist) {
      CURRENT_PLAYLIST_TRACKS.set(await database.getPlaylistTracks($CURRENT_PLAYLIST_ID));
    }
  };

  $: {
    $PLAYER_PAUSED;
    useLocalStorage('set', LocalKeys.PLAYER_PAUSED, String($PLAYER_PAUSED));
  }

  $: {
    $PLAYER_VOLUME;
    if ($AUDIO_ELEMENT) {
      useLocalStorage('set', LocalKeys.PLAYER_VOLUME, String($PLAYER_VOLUME));
    }
  }

  $: {
    $CURRENT_PLAYLIST_ID;
    useLocalStorage('set', LocalKeys.CURRENT_PLAYLIST_ID, String($CURRENT_PLAYLIST_ID));
    populatePlaylistTracks();
  }

  $: {
    $CURRENT_PLAYING_TRACK;
    const track = $CURRENT_PLAYING_TRACK;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track?.title,
      artist: track?.artist,
      album: track?.album,
      artwork: [{ src: track?.album_art || '', type: 'image/jpeg' }]
    });
  }

  $: {
    $CURRENT_QUEUE_IDS;
    useLocalStorage('set', LocalKeys.CURRENT_QUEUE_IDS, JSON.stringify($CURRENT_QUEUE_IDS));
  }

  $: {
    $SHUFFLE_ON;
    if ($SHUFFLE_ON) {
      useLocalStorage('set', LocalKeys.CURRENT_QUEUE_IDS, JSON.stringify($CURRENT_QUEUE_IDS));
    }
    useLocalStorage('set', LocalKeys.SHUFFLE_ON, String($SHUFFLE_ON));
  }

  $: {
    $REPEAT_MODE;
    useLocalStorage('set', LocalKeys.REPEAT_MODE, $REPEAT_MODE);
  }
</script>

{#if $CURRENT_PLAYING_TRACK}
  <audio
    title={$CURRENT_PLAYING_TRACK.title}
    src={convertFileSrc($CURRENT_PLAYING_TRACK.source)}
    class="hidden"
    bind:this={$AUDIO_ELEMENT}
    bind:duration={$CURRENT_PLAYING_TRACK_DURATION}
    bind:currentTime={$CURRENT_PLAYING_TRACK_TIME}
    bind:volume={$PLAYER_VOLUME}
    bind:paused={$PLAYER_PAUSED}
    on:loadedmetadata={() => ($PLAYER_PAUSED ? null : $AUDIO_ELEMENT.play())}
    on:ended={next}
  />
{/if}

<main
  class="relative flex h-screen w-screen select-none overflow-hidden overscroll-none bg-slate-900/75 {!$windowMaximized &&
    'rounded-md'}"
>
  <AppBar />
  <div class="w-64 h-full">
    <AppSideBar />
  </div>
  <div class="flex h-full w-[calc(100%_-_16rem)] pt-[3rem] {$CURRENT_PLAYING_TRACK && 'pb-20'}">
    <ScrollView
      class="w-full h-full px-4"
      element="div"
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
    >
      <slot />
    </ScrollView>
  </div>
  <div class="absolute bottom-0 right-0 w-[calc(100%_-_16rem)] h-20">
    <AppPlayer />
  </div>
</main>
