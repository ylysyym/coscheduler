<template>
    <div v-if="isLoading" class="loading-container">
        <n-spin size="large" />
    </div>
    <template v-else-if="!scheduleStore.hasError">
        <div class="control-panel">
            <InfoPanel />
            <ControlPanel v-if="!isSmallScreen" />
        </div>
        <div class="block-grid">
            <n-scrollbar>
                <BlockGrid />
            </n-scrollbar>
        </div>
        <div v-if="isSmallScreen" class="control-panel">
            <ControlPanel class="small-control-panel" />
        </div>
    </template>
    <ErrorDisplay v-else class="error-display" />
</template>

<script setup lang="ts">
import { NScrollbar, NSpin } from 'naive-ui';
import { ref } from 'vue';
import BlockGrid from '@/components/BlockGrid.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import InfoPanel from '@/components/InfoPanel.vue';
import { useScheduleStore } from '@/stores/schedule';
import { useUiStore } from '@/stores/ui';
import { isSmallScreen } from '@/utilities/breakpoints';

const props = defineProps<{
    id: string;
}>();

const scheduleStore = useScheduleStore();
const uiStore = useUiStore();

uiStore.setScheduleId(props.id);

const isLoading = ref(!(props.id in scheduleStore.schedules));

scheduleStore.initialiseSchedule(props.id).then(() => {
    isLoading.value = false;
    if (!scheduleStore.hasError) {
        uiStore.selectedNames = scheduleStore.people;
    }
});
</script>

<style scoped>
.loading-container {
    align-content: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
}

.block-grid,
.control-panel,
.error-display {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}

.block-grid {
    height: calc(100% - 42px - 200px);
}

.small-control-panel {
    height: 200px;
}

@media (min-width: 900px) {
    .block-grid,
    .control-panel,
    .error-display {
        height: 100%;
    }

    .block-grid {
        margin-top: -40px;
        position: absolute;
        width: calc(100% - 400px);
    }

    .control-panel {
        width: 400px;
    }
}
</style>
