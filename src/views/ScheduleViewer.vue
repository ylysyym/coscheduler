<template>
    <template v-if="!scheduleStore.hasError">
        <div class="control-panel">
            <n-dialog-provider>
                <ControlPanel />
            </n-dialog-provider>
        </div>
        <div class="block-grid">
            <n-scrollbar>
                <BlockGrid />
            </n-scrollbar>
        </div>
    </template>
    <ErrorDisplay class="error-display" v-else />
</template>

<script setup lang="ts">
import { NDialogProvider, NScrollbar } from 'naive-ui';
import BlockGrid from '@/components/BlockGrid.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { useScheduleStore } from '@/stores/schedule';
import { useUiStore } from '@/stores/ui';

const props = defineProps<{
    id: string;
}>();

const scheduleStore = useScheduleStore();
const uiStore = useUiStore();

scheduleStore.initialiseSchedule(props.id).then(() => {
    uiStore.selectedNames = scheduleStore.people;
});
</script>

<style scoped>
.block-grid,
.control-panel,
.error-display {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}

@media (min-width: 900px) {
    .block-grid,
    .control-panel,
    .error-display {
        height: calc(100% - 40px);
    }
    .block-grid {
        width: calc(100% - 400px);
    }

    .control-panel {
        width: 400px;
    }
}
</style>
