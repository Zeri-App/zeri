<script lang="ts">
  import '../app.css';
  import 'overlayscrollbars/overlayscrollbars.css';

  import { windowMaximized } from '@app/stores/windowstore';
  import AppMain from '@app/components/window/AppMain.svelte';
</script>

<AppMain>
  <slot />
</AppMain>
