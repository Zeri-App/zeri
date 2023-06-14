<script lang="ts">
  import {
    CURRENT_PLAYING_TRACK,
    CURRENT_PLAYING_TRACK_ID,
    CURRENT_PLAYING_TRACK_TIME,
    CURRENT_PLAYING_TRACK_DURATION,
    AUDIO_ELEMENT,
    PLAYER_PAUSED,
    SHUFFLE_ON,
    REPEAT_MODE,
    PLAYER_VOLUME,
    TEMP_PLAYER_VOLUME
  } from '@app/stores/playerStore';
  import { formatDuration } from '@app/utils/audioUtils';
  import RepeatIcon from '@app/components/icons/RepeatIcon.svelte';
  import RepeatOneIcon from '@app/components/icons/RepeatOneIcon.svelte';
  import ShuffleIcon from '@app/components/icons/ShuffleIcon.svelte';
  import PreviousIcon from '@app/components/icons/PreviousIcon.svelte';
  import PlayIcon from '@app/components/icons/PlayIcon.svelte';
  import PauseIcon from '@app/components/icons/PauseIcon.svelte';
  import NextIcon from '@app/components/icons/NextIcon.svelte';
  import SpeakerXIcon from '@app/components/icons/SpeakerXIcon.svelte';
  import SpeakerIcon from '@app/components/icons/SpeakerIcon.svelte';
  import HeartIcon from '@app/components/icons/HeartIcon.svelte';

  import { next, previous, togglePlay, toggleShuffle, toggleRepeat } from '@app/controls';
  import database from '@app/database';

  let mouseOver: boolean = false;
  let mouseDrag: boolean = false;
  let mouseEnter: boolean = false;
  let timeTooltipPosition: number = 0;
  let progressBar: HTMLDivElement;
  let tooltipTime: string;

  let mouseOverVolume: boolean = false;
  let mouseDragVolume: boolean = false;
  let volumeSeekPosition: number = 0;
  let volumeBar: HTMLDivElement;

  const seekAudioTime = () => {
    $AUDIO_ELEMENT.currentTime =
      $AUDIO_ELEMENT.duration * (timeTooltipPosition / progressBar.offsetWidth);
  };

  const seekVolume = () => {
    PLAYER_VOLUME.set(Number(Number(volumeSeekPosition / volumeBar.offsetWidth).toFixed(1)));
  };

  const handleSeekOnMouseMove = (event: MouseEvent): void => {
    if (!event.target) return;
    if (mouseOver) mouseDrag = true;
    timeTooltipPosition = event.offsetX;
    if (mouseDrag) seekAudioTime();
  };

  const handleSeekOnMouseDown = (): void => {
    mouseOver = true;
  };

  const handleSeekOnMouseUp = () => {
    mouseOver = false;
    if (mouseDrag) mouseDrag = false;
    else seekAudioTime();
  };

  const handleSeekOnMouseLeave = () => {
    mouseOver = false;
    mouseDrag = false;
    mouseEnter = false;
  };

  const handleSeekOnMouseEnter = () => {
    mouseEnter = true;
  };

  const handleVolumeSeekOnMouseMove = (event: MouseEvent): void => {
    if (!event.target) return;
    if (mouseOverVolume) mouseDragVolume = true;
    volumeSeekPosition = event.offsetX;
    if (mouseDragVolume) seekVolume();
  };

  const handleVolumeSeekOnMouseDown = () => {
    mouseOverVolume = true;
  };

  const handleVolumeSeekOnMouseUp = () => {
    mouseOverVolume = false;
    if (mouseDragVolume) mouseDragVolume = false;
    else seekVolume();
  };

  const handleVolumeSeekOnMouseLeave = (): void => {
    mouseOverVolume = false;
    mouseDragVolume = false;
  };

  const handleTrackLikeButtonPressed = async (): Promise<void> => {
    if ($CURRENT_PLAYING_TRACK!.liked) {
      await database.removeTrackFromLikedPlaylist($CURRENT_PLAYING_TRACK_ID);
      $CURRENT_PLAYING_TRACK!.liked = false;
    } else {
      await database.addTrackToLikedPlaylist($CURRENT_PLAYING_TRACK_ID);
      $CURRENT_PLAYING_TRACK!.liked = true;
    }
  };

  $: timePlayed = Number(
    ($CURRENT_PLAYING_TRACK_TIME / ($CURRENT_PLAYING_TRACK_DURATION || 0)) * 100
  ).toFixed(2);

  $: {
    const progressBarWidth = progressBar ? progressBar.clientWidth : 0;
    const seekTime = ($CURRENT_PLAYING_TRACK_DURATION / progressBarWidth) * timeTooltipPosition;
    tooltipTime = formatDuration(seekTime);
  }
</script>

{#if $CURRENT_PLAYING_TRACK !== undefined}
  <div class="relative w-full h-full bg-slate-900/75">
    <div
      class="group absolute left-0 top-0 h-[0.125rem] w-full cursor-pointer bg-slate-700 hover:h-1 hover:-translate-y-[calc(0.125rem_/_2)]"
      on:mouseup={handleSeekOnMouseUp}
      on:mousedown={handleSeekOnMouseDown}
      on:mousemove={handleSeekOnMouseMove}
      on:mouseleave={handleSeekOnMouseLeave}
      on:mouseenter={handleSeekOnMouseEnter}
      bind:this={progressBar}
    >
      <div class="h-full bg-indigo-500" style="width: {timePlayed}%" />
      <div
        class="absolute group-hover:flex hidden top-1/2 pointer-events-none transform -translate-y-1/2 -translate-x-1/2 rounded-full bg-indigo-500 w-4 h-4"
        style="left: {timePlayed}%"
      />
      {#if mouseEnter}
        <div
          class="absolute pointer-events-none bg-slate-900 px-2 py-[2px] rounded-md text-gray-400 text-xs -top-8 transform -translate-x-1/2"
          style="left: {timeTooltipPosition}px"
        >
          {tooltipTime}
        </div>
      {/if}
    </div>
    <div class="w-full h-full flex justify-between">
      <div class="h-full w-full flex items-center px-4 space-x-4 justify-between">
        <img
          src={$CURRENT_PLAYING_TRACK.album_art}
          alt={$CURRENT_PLAYING_TRACK.title}
          class="h-16 w-16 aspect-square object-contain"
        />
        <div class="h-fit w-full flex flex-col text-sm">
          <h3 class="line-clamp-2 text-slate-100">{$CURRENT_PLAYING_TRACK.title}</h3>
          <a
            href="/artists/{$CURRENT_PLAYING_TRACK.artist}"
            class="line-clamp-1 w-fit text-slate-400 hover:underline"
            >{$CURRENT_PLAYING_TRACK.artist}</a
          >
        </div>
      </div>
      <div class="h-full w-[50rem] flex items-center justify-center px-8">
        <div class="h-fit w-1/5 flex justify-center">
          <button
            class="focus:outline-none active:text-slate-600 {$SHUFFLE_ON
              ? 'text-indigo-500'
              : 'text-slate-400'}"
            on:click={toggleShuffle}
          >
            <ShuffleIcon class="w-6 h-6" /></button
          >
        </div>
        <div class="h-fit w-1/5 flex justify-center">
          <button
            class="focus:outline-none text-slate-400 active:text-slate-600"
            on:click={previous}
          >
            <PreviousIcon class="w-7 h-7" /></button
          >
        </div>
        <div class="h-fit w-1/5 flex justify-center">
          <button
            class="focus:outline-none p-2 active:bg-slate-600 rounded-full bg-slate-400 flex items-center justify-center"
            on:click={togglePlay}
          >
            {#if $PLAYER_PAUSED}
              <PlayIcon
                class="w-7 h-7 transform translate-x-[2px] fill-current text-slate-900/90"
              />
            {:else}
              <PauseIcon class="w-7 h-7 fill-current text-slate-900/90" />
            {/if}
          </button>
        </div>
        <div class="h-fit w-1/5 flex justify-center">
          <button class="focus:outline-none text-slate-400 active:text-slate-600" on:click={next}>
            <NextIcon class="w-7 h-7" /></button
          >
        </div>
        <div class="h-fit w-1/5 flex justify-center">
          <button
            class="focus:outline-none {$REPEAT_MODE === 'OFF'
              ? 'text-slate-400 active:text-slate-600'
              : 'text-indigo-500 active:text-indigo-600'}"
            on:click={toggleRepeat}
          >
            {#if $REPEAT_MODE === 'ONE'}
              <RepeatOneIcon class="w-6 h-6" />
            {:else}
              <RepeatIcon class="w-6 h-6" />
            {/if}
          </button>
        </div>
      </div>
      <div class="h-full w-full flex items-center flex-row-reverse px-4">
        <div class="w-fit h-fit flex items-center space-x-4">
          <button on:click={handleTrackLikeButtonPressed}
            ><HeartIcon
              class="w-6 h-6 {$CURRENT_PLAYING_TRACK.liked
                ? 'fill-current text-indigo-500 active:text-indifo-600'
                : 'text-slate-400 active:text-slate-600'}"
            /></button
          >
          <div
            class="w-24 h-3 py-1 flex cursor-pointer"
            on:mousedown={handleVolumeSeekOnMouseDown}
            on:mouseup={handleVolumeSeekOnMouseUp}
            on:mousemove={handleVolumeSeekOnMouseMove}
            on:mouseleave={handleVolumeSeekOnMouseLeave}
            bind:this={volumeBar}
          >
            <div class="w-full h-1 bg-slate-700 rounded-md overflow-hidden">
              <div class="h-1 bg-indigo-500 rounded-r-md" style="width: {$PLAYER_VOLUME * 100}%" />
            </div>
          </div>
          {#if $PLAYER_VOLUME === 0}
            <button on:click={() => ($PLAYER_VOLUME = $TEMP_PLAYER_VOLUME)}>
              <SpeakerXIcon class="h-6 w-6 text-slate-400 active:text-slate-600" />
            </button>
          {:else}
            <button
              on:click={() => {
                $TEMP_PLAYER_VOLUME = $PLAYER_VOLUME;
                $PLAYER_VOLUME = 0;
              }}><SpeakerIcon class="h-6 w-6 text-slate-400 active:text-slate-600" /></button
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
