<script lang="ts">
  import { LocalKeys } from '@app/constants';
  import database from '@app/database';
  import {
    CURRENT_PLAYING_TRACK_ID,
    CURRENT_PLAYING_TRACK_TIME,
    CURRENT_PLAYLIST_ID,
    CURRENT_QUEUE_IDS,
    PLAYER_PAUSED
  } from '@app/stores/playerStore';
  import type { Track } from '@app/types';

  export let tracks: Track[];
  export let resetTracksOnClick = true;

  const handleDoubleClick = async (track: Track) => {
    $CURRENT_PLAYING_TRACK_ID = track.id;
    $CURRENT_PLAYING_TRACK_TIME = 0;

    if (resetTracksOnClick) {
      const playlist = await database.getPlaylist($CURRENT_PLAYLIST_ID);
      $CURRENT_QUEUE_IDS = playlist?.tracks || [];
    }

    $PLAYER_PAUSED = false;
  };
</script>

<div class="w-full h-fit">
  {#if tracks.length > 0}
    {#each tracks as track (track.id)}
      <div on:dblclick={() => handleDoubleClick(track)} class="w-full h-[16vh] py-[2vh] flex">
        <div class="h-full w-[12%] border flex items-center overflow-hidden">
          <img src={track.album_art} alt={track.title} />
        </div>
        <div class="h-full w-[32%] border">{track.id}</div>
        <div class="h-full w-[24%] border" />
        <div class="h-full w-[24%] border" />
        <div class="h-full w-[8%] border" />
      </div>
    {/each}
  {/if}
</div>
