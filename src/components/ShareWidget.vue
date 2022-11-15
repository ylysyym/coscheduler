<template>
    <div class="share-widget">
        <n-input-group>
            <n-input ref="input" :value="shareLink" @click="select" />
            <n-button @click="copy">Copy</n-button>
        </n-input-group>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NInput, NInputGroup } from 'naive-ui';
import { useUiStore } from '@/stores/ui';
import { useClipboard } from '@vueuse/core';

const uiStore = useUiStore();

const clipboard = useClipboard();

const shareLink = computed(() => {
    return `${window.location.origin}/schedule/${uiStore.scheduleId}`;
});

const input = ref<InstanceType<typeof NInput>>();

const select = () => {
    input.value?.select();
};

const copy = () => {
    clipboard.copy(shareLink.value);
};
</script>
