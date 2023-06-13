<script lang="ts">
  import { appWindow } from '@tauri-apps/api/window';

  import { windowMaximized, windowFocused } from '@app/stores/windowStore';
  import MinimizeIcon from '@app/components/icons/MinimizeIcon.svelte';
  import XIcon from '@app/components/icons/XIcon.svelte';
  import RestoreIcon from '@app/components/icons/RestoreIcon.svelte';
  import MaximizeIcon from '@app/components/icons/MaximizeIcon.svelte';

  const windowMinimize: () => Promise<void> = async (): Promise<void> => await appWindow.minimize();
  const windowClose: () => Promise<void> = async (): Promise<void> => await appWindow.close();
  const windowToggleMaximize: () => Promise<void> = async (): Promise<void> =>
    await appWindow.toggleMaximize();
</script>

<div data-tauri-drag-region class="flex h-12 w-full flex-row-reverse px-2 fixed top-0 left-0">
  <div class="flex h-full w-[4.5rem] items-center justify-between">
    <div class="flex h-6 w-6 items-center justify-center">
      <button
        disabled={!$windowFocused}
        on:click={windowMinimize}
        class="flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full {$windowFocused
          ? 'group border border-[#FFA020] bg-[#FFBD44]'
          : 'bg-[#999999]'}"
      >
        <span class="hidden h-3 w-3 text-black group-hover:flex">
          <MinimizeIcon class="h-full w-full" />
        </span>
      </button>
    </div>
    <div class="flex h-6 w-6 items-center justify-center">
      <button
        disabled={!$windowFocused}
        on:click={windowToggleMaximize}
        class="flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full {$windowFocused
          ? 'group border border-[#00BC42] bg-[#00D455]'
          : 'bg-[#999999]'}"
      >
        <span class="hidden h-3 w-3 text-black group-hover:flex">
          {#if $windowMaximized}
            <RestoreIcon class="w-full h-full" />
          {:else}
            <MaximizeIcon class="w-full h-full" />
          {/if}
        </span>
      </button>
    </div>
    <div class="flex h-6 w-6 items-center justify-center">
      <button
        disabled={!$windowFocused}
        on:click={windowClose}
        class="flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full {$windowFocused
          ? 'group border border-[#FF3B38] bg-[#FF605C]'
          : 'bg-[#999999]'}"
      >
        <span class="hidden h-3 w-3 text-black group-hover:flex">
          <XIcon class="h-full w-full" />
        </span>
      </button>
    </div>
  </div>
</div>
