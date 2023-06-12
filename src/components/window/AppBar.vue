<script setup lang="ts">
  import XUnableIcon from '@/components/icons/XUnableIcon.vue';
  import XIcon from '@/components/icons/XIcon.vue';
  import RestoreIcon from '@/components/icons/RestoreIcon.vue';
  import MinimizeIcon from '@/components/icons/MinimizeIcon.vue';
  import MaximizeIcon from '@/components/icons/MaximizeIcon.vue';

  import { useWindowStore } from '@/stores/windowstore';

  import { appWindow } from '@tauri-apps/api/window';

  const window = useWindowStore();
  const maximized = window.isMaximized();
  const focused = window.isFocused();
</script>

<script lang="ts"></script>

<template>
  <div data-tauri-drag-region class="flex h-full w-full flex-row-reverse px-2">
    <div class="flex h-full w-[4.5rem] items-center justify-between">
      <div class="flex h-6 w-6 items-center justify-center">
        <button
          :disabled="!focused"
          @click="appWindow.minimize()"
          :class="{
            'flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full': true,
            'group border border-[#FFA020] bg-[#FFBD44]': focused,
            'bg-[#999999]': !focused
          }">
          <span class="hidden h-3 w-3 text-black group-hover:flex">
            <MinimizeIcon />
          </span>
        </button>
      </div>
      <div class="flex h-6 w-6 items-center justify-center">
        <button
          :disabled="!focused"
          @click="appWindow.toggleMaximize()"
          :class="{
            'flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full': true,
            'group border border-[#00BC42] bg-[#00D455]': focused,
            'bg-[#999999]': !focused
          }">
          <span class="hidden h-3 w-3 text-black group-hover:flex">
            <RestoreIcon v-if="maximized" />
            <MaximizeIcon v-else />
          </span>
        </button>
      </div>
      <div class="flex h-6 w-6 items-center justify-center">
        <button
          :disabled="!focused"
          @click="appWindow.close()"
          :class="{
            'flex h-[0.875rem] w-[0.875rem] items-center justify-center rounded-full': true,
            'group border border-[#FF3B38] bg-[#FF605C]': focused,
            'bg-[#999999]': !focused
          }">
          <span
            class="text-blacl h-3 w-3 transform opacity-0 transition duration-100 group-hover:opacity-100">
            <XIcon />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
