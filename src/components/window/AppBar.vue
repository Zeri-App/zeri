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

<script lang="ts">
</script>

<template>
  <div data-tauri-drag-region class="h-full w-full flex flex-row-reverse px-2">
    <div class="h-full w-[4.5rem] justify-between flex items-center">
      <div class="w-6 h-6 flex justify-center items-center">
        <button @click="appWindow.minimize()"
          :class="{ 'group w-[0.875rem] h-[0.875rem] flex items-center justify-center rounded-full': true, 'bg-[#FFBD44] border border-[#FFA020]': focused, 'bg-[#999999]': !focused }">
          <span class="w-3 h-3 text-black hidden group-hover:flex">
            <MinimizeIcon />
          </span>
        </button>
      </div>
      <div class="w-6 h-6 flex justify-center items-center">
        <button @click="appWindow.toggleMaximize()"
          :class="{ 'group w-[0.875rem] h-[0.875rem] flex items-center justify-center rounded-full': true, 'bg-[#00D455] border border-[#00BC42]': focused, 'bg-[#999999]': !focused }">
          <span class="w-3 h-3 text-black hidden group-hover:flex">
            <RestoreIcon v-if="maximized" />
            <MaximizeIcon v-else />
          </span>
        </button>
      </div>
      <div class="w-6 h-6 flex justify-center items-center">
        <button
          :class="{ 'group w-[0.875rem] h-[0.875rem] flex items-center justify-center rounded-full': true, 'bg-[#FF605C] border border-[#FF3B38]': focused, 'bg-[#999999]': !focused }">
          <span class="w-3 h-3 text-blacl opacity-0 group-hover:opacity-100 transition transform duration-100">
            <XIcon />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

