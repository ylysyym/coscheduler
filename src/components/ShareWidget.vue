<template>
    <div>
        <n-input-group>
            <n-input ref="input" :value="shareLink" @click="selectAll" />
            <n-button @click="copyLink">Copy</n-button>
        </n-input-group>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NInput, NInputGroup } from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const clipboard = useClipboard();

const shareLink = computed(() => {
    return `${window.location.origin}/schedule/${uiStore.scheduleId}`;
});

const input = ref<InstanceType<typeof NInput>>();

const selectAll = () => {
    input.value?.select();
};

const copyLink = () => {
    clipboard.copy(shareLink.value);
};
</script>
