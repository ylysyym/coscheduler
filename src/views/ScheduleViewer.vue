<template>
    <template v-if="isValidId">
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
    <ErrorDisplay class="error-display" :error="errorMessage" v-else />
</template>

<script setup lang="ts">
import { ref } from 'vue';
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

const isValidId = ref(true);
const errorMessage = ref();

scheduleStore
    .initialiseSchedule(props.id)
    .then(() => {
        uiStore.selectedNames = scheduleStore.people;
    })
    .catch((err) => {
        errorMessage.value = err;
        isValidId.value = false;
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
