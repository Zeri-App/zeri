import { get } from 'svelte/store';
import {
  AUDIO_ELEMENT,
  CURRENT_PLAYING_TRACK,
  CURRENT_PLAYING_TRACK_ID,
  CURRENT_PLAYING_TRACK_TIME,
  CURRENT_QUEUE_IDS,
  PLAYER_PAUSED,
  REPEAT_MODE,
  SHUFFLE_ON
} from './stores/playerStore';

export const togglePlay: () => void = (): void => {
  const $AUDIO_ELEMENT = get(AUDIO_ELEMENT);
  if ($AUDIO_ELEMENT.paused) {
    $AUDIO_ELEMENT.currentTime = get(CURRENT_PLAYING_TRACK_TIME);
    $AUDIO_ELEMENT.play();
  } else {
    $AUDIO_ELEMENT.pause();
  }
};

export const next: () => void = (): void => {
  PLAYER_PAUSED.set(false);
  const $CURRENT_PLAYING_TRACK = get(CURRENT_PLAYING_TRACK);

  if (!$CURRENT_PLAYING_TRACK) return;

  if (get(REPEAT_MODE) === 'ONE') {
    get(AUDIO_ELEMENT).load();
    return;
  }

  const $CURRENT_QUEUE_IDS = get(CURRENT_QUEUE_IDS);
  const currentIndex = $CURRENT_QUEUE_IDS.findIndex((id) => id === $CURRENT_PLAYING_TRACK.id);
  if (currentIndex === $CURRENT_QUEUE_IDS.length - 1) {
    CURRENT_PLAYING_TRACK_ID.set($CURRENT_QUEUE_IDS[0]);
    if (get(REPEAT_MODE) === 'OFF') {
      get(AUDIO_ELEMENT).pause();
      get(AUDIO_ELEMENT).currentTime = 0;
      PLAYER_PAUSED.set(true);
    }
  } else {
    CURRENT_PLAYING_TRACK_ID.set($CURRENT_QUEUE_IDS[currentIndex + 1]);
  }
};

export const previous: () => void = (): void => {
  const $CURRENT_PLAYING_TRACK = get(CURRENT_PLAYING_TRACK);
  const $CURRENT_QUEUE_IDS = get(CURRENT_QUEUE_IDS);

  if (!$CURRENT_PLAYING_TRACK) return;

  const currentIndex = $CURRENT_QUEUE_IDS.findIndex((id) => id === $CURRENT_PLAYING_TRACK.id);
  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      CURRENT_PLAYING_TRACK_ID.set($CURRENT_QUEUE_IDS[currentIndex - 1]);
    } else {
      CURRENT_PLAYING_TRACK_ID.set($CURRENT_QUEUE_IDS[$CURRENT_QUEUE_IDS.length - 1]);
    }
  }
};

export const toggleShuffle: () => void = (): void => {
  SHUFFLE_ON.set(!get(SHUFFLE_ON));
  if (get(SHUFFLE_ON)) {
    const $CURRENT_QUEUE_IDS = get(CURRENT_QUEUE_IDS);
    const $CURRENT_PLAYING_TRACK_ID = get(CURRENT_PLAYING_TRACK_ID);
    const without = $CURRENT_QUEUE_IDS.filter((id) => id !== $CURRENT_PLAYING_TRACK_ID);
    for (let i = without.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() & (i + 1));
      [without[i], without[j]] = [without[j], without[i]];
    }
    CURRENT_QUEUE_IDS.set([$CURRENT_PLAYING_TRACK_ID, ...without]);
  }
};

export const toggleRepeat: () => void = (): void => {
  const $REPEAT_MODE = get(REPEAT_MODE);

  if ($REPEAT_MODE === 'OFF') {
    REPEAT_MODE.set('ALL');
  } else if ($REPEAT_MODE === 'ALL') {
    REPEAT_MODE.set('ONE');
  } else {
    REPEAT_MODE.set('OFF');
  }
};
