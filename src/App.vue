<script setup lang="ts">
import Main from '@/components/window/Main.vue';
</script>

<template>
  <Teleport to="body">
    <div id="teleport"></div>
  </Teleport>
  <Main>
  </Main>
</template>
