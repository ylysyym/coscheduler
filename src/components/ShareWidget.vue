<template>
    <div class="share-widget">
        <n-input-group>
            <n-input-group-label>Share</n-input-group-label>
            <n-input ref="input" :value="shareLink" @click="select" />
            <n-button @click="copy">Copy</n-button>
        </n-input-group>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NInput, NInputGroup, NInputGroupLabel } from 'naive-ui';
import { useScheduleStore } from '@/stores/schedule';
import { useClipboard } from '@vueuse/core';

const scheduleStore = useScheduleStore();

const clipboard = useClipboard();

const shareLink = computed(() => {
    return `${window.location.origin}/schedule/${scheduleStore.id}`;
});

const input = ref<InstanceType<typeof NInput>>();

const select = () => {
    input.value?.select();
};

const copy = () => {
    clipboard.copy(shareLink.value);
};
</script>

<style scoped>
.share-widget {
    margin: 8px 0;
}
</style>
