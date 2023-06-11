<script setup lang="ts">
import {
    type OverlayScrollbarsComponentRef,
    OverlayScrollbarsComponent as ScrollView
} from 'overlayscrollbars-vue';
import { type PartialOptions } from 'overlayscrollbars';
import { appWindow } from '@tauri-apps/api/window';
import { onMounted, ref, watch } from 'vue';
import { TauriEvent } from '@tauri-apps/api/event';

import SideBar from '@/components/window/SideBar.vue';
import AppBar from '@/components/window/AppBar.vue';
import { useTauriEvent } from '@/composables/useTauriEvent';
import type { Option } from '@/types';
import { batchFn } from '@/utils/batchfn';
import { useNavStore } from '@/stores/navstore';

const navStore = useNavStore();

const windowMaximized = ref<boolean>(false);
const scrollView = ref<Option<OverlayScrollbarsComponentRef>>(null);

const options = <PartialOptions>{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } };

const updateWindowMaximized = async () => {
    windowMaximized.value = await appWindow.isMaximized();
};

const focusScrollView = batchFn(() => {
    scrollView?.value?.getElement()?.focus();
});

watch(() => navStore.current, focusScrollView, { flush: 'post' });
watch(
    () => navStore.current,
    () => {
        const element = scrollView?.value?.osInstance()?.elements().scrollOffsetElement;
        if (element) element.scrollTop = 0;
    },
    { flush: 'post' }
);

useTauriEvent(TauriEvent.WINDOW_RESIZED, updateWindowMaximized);

onMounted(updateWindowMaximized);
onMounted(focusScrollView);
</script>

<template>
    <main v-bind:class="{
        'w-screen bg-slate-900/75 h-screen overflow-hidden overscroll-none flex': true,
        'rounded-md': !windowMaximized
    }">
        <div class="w-96 h-full border-r border-slate-200/50">
            <SideBar />
        </div>
        <div class="w-full h-full flex flex-col">
            <div class="w-full h-12">
                <AppBar />
            </div>
            <div class="w-full h-[calc(100%_-_3rem)]">
                <ScrollView element="div" defer :options="options" tabindex="-1" class="w-full h-full">
                    <slot />
                </ScrollView>
            </div>
        </div>
    </main>
</template>

            </div>
        </div>
    </main>
</template>