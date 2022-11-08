<template>
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

<script setup lang="ts">
import { NDialogProvider, NScrollbar } from 'naive-ui';
import BlockGrid from '@/components/BlockGrid.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import { useScheduleStore } from '@/stores/schedule';

const scheduleStore = useScheduleStore();

scheduleStore.initialiseSchedule();
</script>

<style scoped>
.block-grid,
.control-panel {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}

@media (min-width: 900px) {
    .block-grid,
    .control-panel {
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
