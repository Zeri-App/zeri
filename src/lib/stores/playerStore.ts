import { useLocalStorage } from '@app/composables/useLocalStorage';
import { LocalKeys } from '@app/constants';
import type { Option, Track } from '@app/types';
import { type Writable, writable, type Readable, readable } from 'svelte/store';

export const AUDIO_ELEMENT: Writable<HTMLAudioElement> = writable<HTMLAudioElement>();
export const PLAYER_PAUSED: Writable<boolean> = writable<boolean>(
  Boolean(useLocalStorage('get', LocalKeys.PLAYER_PAUSED))
);
export const PLAYER_VOLUME: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.PLAYER_VOLUME) || '0.7')
);
export const CURRENT_PLAYING_TRACK: Writable<Track | undefined> = writable<Track | undefined>();
export const CURRENT_PLAYING_TRACK_ID: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYING_TRACK_ID))
);
export const CURRENT_PLAYING_TRACK_TIME: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYING_TRACK_TIME))
);
export const CURRENT_QUEUE_IDS: Writable<number[]> = writable<number[]>(
  JSON.parse(useLocalStorage('get', LocalKeys.CURRENT_QUEUE_IDS) || '[]')
);
export const CURRENT_PLAYLIST_ID: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYLIST_ID) || 0)
);
export const CURRENT_PLAYLIST_TRACKS: Writable<Track[]> = writable<Track[]>();
