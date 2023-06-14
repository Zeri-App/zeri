<script lang="ts">
  import type { Track } from '@app/types';
  import { getAudioFilesFromFolder, getMetadata } from '@app/utils/audioUtils';
  import { open } from '@tauri-apps/api/dialog';
  import { readDir } from '@tauri-apps/api/fs';
  import Database from '@app/database';
  import Tracks from '@app/components/layouts/Tracks.svelte';
  import { CURRENT_PLAYLIST_TRACKS as tracks } from '@app/stores/playerStore';
  // let selectedTracks: number[] = [];

  const handleAddNewTrack = async (): Promise<void> => {
    try {
      const entries = await open({
        title: 'Zeri: Select Audio Files',
        multiple: true,
        filters: [{ name: 'Audio', extensions: ['mp3', 'flac'] }]
      });
      if (Array.isArray(entries)) {
        for (const path of entries) {
          await Database.addTrack((await getMetadata(path)) as Track);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNewSourceFolder = async (): Promise<void> => {
    const directory = await open({
      directory: true
    });
    if (typeof directory === 'string') {
      try {
        const entries = await readDir(directory, {
          recursive: true
        });
        await Database.addSourceFolder((await getAudioFilesFromFolder(entries)) as Track[]);
      } catch (error) {
        console.error(error);
      }
    }
  };
</script>

<div class="w-full h-full">
  <Tracks tracks={$tracks} />

  <button on:click={handleAddNewSourceFolder}>Add Folder</button>
  <button on:click={handleAddNewTrack}>Add Track</button>
</div>
