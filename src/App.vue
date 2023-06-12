<script setup lang="ts">
import Main from '@/components/window/Main.vue';

import { usePlayerStore } from './stores/playerstore';
import { onMounted, ref } from 'vue';
import { type Option } from './types';

const playerstore = usePlayerStore();

const audioRef = ref<Option<HTMLAudioElement>>(null);

onMounted(() => {
  playerstore.setAudioDom(audioRef)
});

</script>

<template>
  <Teleport to="body">
    <audio ref="audioRef" />
  </Teleport>
  <Main>
  </Main>
</template>
