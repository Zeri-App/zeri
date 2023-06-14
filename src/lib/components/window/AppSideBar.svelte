<script lang="ts">
  import type { Page } from '@app/types';
  import { Home, NowPlaying, Library, Artists, Albums, Heart, Recents } from '../icons';
  import { page } from '$app/stores';

  const Pages: Page = {
    '/': {
      name: 'Home',
      icon: Home
    },
    '/Recents': {
      name: 'Recently Played',
      icon: Recents
    },
    '/Now-Playing': {
      name: 'Now Playing',
      icon: NowPlaying
    },
    '/Library': {
      name: 'Library',
      icon: Library
    },
    '/Artists': {
      name: 'Artists',
      icon: Artists
    },
    '/Albums': {
      name: 'Albums',
      icon: Albums
    },
    '/Liked': {
      name: 'Liked Songs',
      icon: Heart
    }
  };
</script>

<div class="h-full w-full border-r-[1px] border-gray-200/5 bg-slate-900/75 flex flex-col">
  <div class="w-full h-full px-8 pt-12">
    <div class="h-fit w-full space-y-4 py-6">
      {#each Object.entries(Pages).slice(0, 3) as [key, { name, icon }]}
        <a
          href={key}
          class="flex h-fit w-full items-center space-x-4 text-sm {$page.route.id === key
            ? 'text-slate-100'
            : 'text-slate-400'}"
        >
          <svelte:component this={icon} class="h-5 w-5" />
          <p>{name}</p>
        </a>
      {/each}
    </div>
    <p class="pt-4 text-xs font-bold text-white">YOUR MUSIC</p>
    <div class="h-fit w-full space-y-4 py-6">
      {#each Object.entries(Pages).slice(3, 7) as [key, { name, icon }]}
        <a
          href={key}
          class="flex h-fit w-full items-center space-x-4 text-sm {$page.route.id === key
            ? 'text-slate-100'
            : 'text-slate-400'}"
        >
          <svelte:component this={icon} class="h-5 w-5" />
          <p>{name}</p>
        </a>
      {/each}
    </div>
  </div>
</div>
