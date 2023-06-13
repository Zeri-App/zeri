import { invoke } from '@tauri-apps/api';
import type { FileEntry } from '@tauri-apps/api/fs';
import type { Track } from '@app/types';

export const isAudioFile = async (source: string): Promise<boolean> => {
  return await invoke<boolean>('is_audio', { source });
};

export const getMetadata = async (source: string) => {
  return await invoke<Track>('get_metadata', { source });
};

export const getAudioFilesFromFolder = async (entries: FileEntry[]): Promise<Track[]> => {
  return await invoke<Track[]>('get_audio_files_from_folder', { entries });
};

export const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
