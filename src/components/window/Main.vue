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
import { useRouterStore } from "@/stores/routerstore"
import { useWindowStore } from '@/stores/windowstore';

const router = useRouterStore();
const window = useWindowStore();

const windowMaximized = ref<boolean>(false);
const scrollView = ref<Option<OverlayScrollbarsComponentRef>>(null);

const options = <PartialOptions>{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } };

const updateWindowMaximized = async () => {
    windowMaximized.value = await appWindow.isMaximized();
    window.setMaximized(windowMaximized.value);
};

const updateWindowFocused = (value: boolean) => {
    window.setFocused(value);
}

const focusScrollView = batchFn(() => {
    scrollView?.value?.getElement()?.focus();
});

watch(() => router.current, focusScrollView, { flush: 'post' });
watch(
    () => router.current,
    () => {
        const element = scrollView?.value?.osInstance()?.elements().scrollOffsetElement;
        if (element) element.scrollTop = 0;
    },
    { flush: 'post' }
);

useTauriEvent(TauriEvent.WINDOW_RESIZED, updateWindowMaximized);
useTauriEvent(TauriEvent.WINDOW_FOCUS, () => updateWindowFocused(true));
useTauriEvent(TauriEvent.WINDOW_BLUR, () => updateWindowFocused(false));

onMounted(updateWindowMaximized);
onMounted(focusScrollView);
</script>

<template>
    <main :class="{
        'flex h-screen w-screen overflow-hidden overscroll-none bg-slate-900/75': true,
        'rounded-md': !windowMaximized
    }">
        <SideBar />
        <div class="relative flex h-full w-full flex-col">
            <div class="h-12 w-full">
                <AppBar />
            </div>
            <div class="h-[calc(100%_-_3rem)] w-full">
                <ScrollView element="div" defer :options="options" tabindex="-1" class="h-full w-full">
                    <slot />
                </ScrollView>
            </div>
            <div class="absolute bottom-0 right-0 h-20 w-full"></div>
        </div>
    </main>
</template>
