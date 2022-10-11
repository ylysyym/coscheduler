<template>
    <div class="control-panel">
        <ControlPanel />
    </div>
    <div class="block-grid">
        <BlockGrid />
    </div>
    <div class="detail-panel" v-if="appStore.isEditing">
        <DetailPanel />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BlockGrid from '@/components/BlockGrid.vue';
import DetailPanel from '@/components/DetailPanel.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import { useAppStore } from '@/stores/app';
import { useGridStateStore } from '@/stores/gridState';

const appStore = useAppStore();
const gridStateStore = useGridStateStore();

gridStateStore.initialiseEndpoints();

let detailPanelWidth = computed(() => (appStore.isEditing ? 300 : 0) + 'px');
</script>

<style scoped>
.block-grid,
.detail-panel,
.control-panel {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}
@media (min-width: 900px) {
    .block-grid,
    .detail-panel,
    .control-panel {
        height: calc(100% - 40px);
    }
    .block-grid {
        width: calc(100% - 160px - v-bind(detailPanelWidth));
    }
    .detail-panel {
        width: 300px;
    }

    .control-panel {
        width: 160px;
    }
}
</style>
