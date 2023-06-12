import { defineStore } from "pinia"
import { ref, type Ref } from "vue"
import type { Option } from "@/types"

export const usePlayerStore = defineStore("player", () => {
    const audioDom = ref<Option<HTMLAudioElement>>(null);

    const setAudioDom = (ref: Ref<Option<HTMLAudioElement>>) => {
        audioDom.value = ref.value;
    }

    return {
        audioDom,
        setAudioDom
    }
})