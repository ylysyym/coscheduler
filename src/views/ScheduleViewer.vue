<template>
    <div class="title-bar">
        <TitleBar @showJoinDialog="showJoinDialog" />
    </div>
    <div class="control-panel">
        <ControlPanel @showJoinDialog="showJoinDialog" />
    </div>
    <div class="block-grid">
        <BlockGrid />
    </div>
    <div class="detail-panel" v-if="appStore.isEditing">
        <DetailPanel />
    </div>
    <JoinModal ref="joinModal" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import BlockGrid from '@/components/BlockGrid.vue';
import DetailPanel from '@/components/DetailPanel.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import JoinModal from '@/components/JoinModal.vue';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

scheduleStore.initialiseSchedule();

let joinModal = ref<typeof JoinModal>();

const showJoinDialog = () => {
    joinModal.value?.show();
};

let detailPanelWidth = computed(() => (appStore.isEditing ? 300 : 0) + 'px');
</script>

<style scoped>
.title-bar,
.block-grid,
.detail-panel,
.control-panel {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}

.title-bar {
    height: 80px;
    padding: 0;
}

@media (min-width: 900px) {
    .block-grid,
    .detail-panel,
    .control-panel {
        height: calc(100% - 120px);
    }
    .block-grid {
        width: calc(100% - 160px - v-bind(detailPanelWidth));
    }
    .detail-panel {
        width: 300px;
    }

    .title-bar {
        padding-left: 160px;
    }

    .control-panel {
        width: 160px;
    }
}
</style>
