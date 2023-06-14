import { useLocalStorage } from '@app/composables/useLocalStorage';
import { LocalKeys } from '@app/constants';
import type { Repeat, Track } from '@app/types';
import { type Writable, writable } from 'svelte/store';

export const AUDIO_ELEMENT: Writable<HTMLAudioElement> = writable<HTMLAudioElement>();
export const PLAYER_PAUSED: Writable<boolean> = writable<boolean>(
  String(useLocalStorage('get', LocalKeys.PLAYER_PAUSED)) === 'true'
);
export const PLAYER_VOLUME: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.PLAYER_VOLUME) || '0.7')
);
export const TEMP_PLAYER_VOLUME: Writable<number> = writable<number>(0);
export const SHUFFLE_ON: Writable<boolean> = writable<boolean>(
  useLocalStorage('get', LocalKeys.SHUFFLE_ON) === 'true'
);
export const REPEAT_MODE: Writable<Repeat> = writable<Repeat>(
  <Repeat>useLocalStorage('get', LocalKeys.REPEAT_MODE) || 'OFF'
);
export const CURRENT_PLAYING_TRACK: Writable<Track | undefined> = writable<Track | undefined>();
export const CURRENT_PLAYING_TRACK_ID: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYING_TRACK_ID))
);
export const CURRENT_PLAYING_TRACK_TIME: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYING_TRACK_TIME))
);
export const CURRENT_PLAYING_TRACK_DURATION: Writable<number> = writable<number>(0);
export const CURRENT_QUEUE_IDS: Writable<number[]> = writable<number[]>(
  JSON.parse(useLocalStorage('get', LocalKeys.CURRENT_QUEUE_IDS) || '[]')
);
export const CURRENT_PLAYLIST_ID: Writable<number> = writable<number>(
  Number(useLocalStorage('get', LocalKeys.CURRENT_PLAYLIST_ID) || 0)
);
export const CURRENT_PLAYLIST_TRACKS: Writable<Track[]> = writable<Track[]>([]);
