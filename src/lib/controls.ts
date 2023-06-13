import { get } from 'svelte/store';
import {
  AUDIO_ELEMENT,
  CURRENT_PLAYING_TRACK,
  CURRENT_PLAYING_TRACK_ID,
  CURRENT_PLAYING_TRACK_TIME,
  CURRENT_QUEUE_IDS
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
  const $CURRENT_PLAYING_TRACK = get(CURRENT_PLAYING_TRACK);

  if (!$CURRENT_PLAYING_TRACK) return;

  const $CURRENT_QUEUE_IDS = get(CURRENT_QUEUE_IDS);
  const currentIndex = $CURRENT_QUEUE_IDS.findIndex((id) => id === $CURRENT_PLAYING_TRACK.id);
  CURRENT_PLAYING_TRACK_ID.set($CURRENT_QUEUE_IDS[currentIndex + 1]);
  if (currentIndex !== -1) {
    CURRENT_PLAYING_TRACK_ID.set(
      $CURRENT_QUEUE_IDS[(currentIndex + 1) % $CURRENT_QUEUE_IDS.length]
    );
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
