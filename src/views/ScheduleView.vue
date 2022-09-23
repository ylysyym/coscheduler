<template>
    <div class="block-grid">
        <BlockGrid />
    </div>
    <div class="detail-panel">
        <DetailPanel />
    </div>
</template>

<script setup lang="ts">
import BlockGrid from '@/components/BlockGrid.vue';
import DetailPanel from '@/components/DetailPanel.vue';
import { useGridStateStore } from '@/stores/gridState';
import { DateTime, Duration } from 'luxon';

const store = useGridStateStore();

const initialiseSchedule = () => {
    const currentDate = DateTime.now().set({
        minute: 0,
        second: 0,
        millisecond: 0,
    });
    const defaultDuration: Duration = Duration.fromObject({
        minutes: store.units,
    });
    store.initialiseBlockData(100, currentDate, defaultDuration);
};

initialiseSchedule();
</script>

<style scoped>
.block-grid,
.detail-panel {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}
@media (min-width: 960px) {
    .block-grid,
    .detail-panel {
        height: calc(100% - 40px);
    }
    .block-grid {
        width: calc(100% - 300px);
    }
    .detail-panel {
        width: 300px;
    }
}
</style>
