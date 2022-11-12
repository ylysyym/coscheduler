<template>
    <div class="container">
        <span class="schedule-title">{{ scheduleStore.title }}</span>
        <n-tabs
            size="large"
            type="segment"
            @update:value="changeTab"
            @before-leave="beforeChangeTab"
            :value="activeTab"
            default-value="view"
        >
            <n-tab-pane name="view" tab="View">
                <ViewPanel />
            </n-tab-pane>
            <n-tab-pane
                name="edit"
                :tab="isEditingExistingUser ? 'Edit' : 'Join'"
            >
                <EditPanel />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, useDialog } from 'naive-ui';
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import EditPanel from '@/components/EditPanel.vue';
import ViewPanel from '@/components/ViewPanel.vue';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const dialog = useDialog();

const activeTab = computed(() => (uiStore.isEditing ? 'edit' : 'view'));

const isEditingExistingUser = computed(() => {
    return uiStore.isEditing && !uiStore.isJoining;
});

const beforeChangeTab = (tabName: string) => {
    if (tabName === 'view') {
        if (hasChanges.value) {
            return new Promise<boolean>((resolve) => {
                dialog.warning({
                    title: 'Unsaved changes',
                    content:
                        'Any unsaved changes will be discarded. Are you sure you want to continue?',
                    positiveText: 'OK',
                    negativeText: 'Cancel',
                    onPositiveClick: () => resolve(true),
                    onNegativeClick: () => resolve(false),
                    onClose: () => resolve(false),
                });
            });
        }
    }

    return true;
};

const changeTab = (tabName: string) => {
    if (tabName === 'edit') {
        uiStore.join();
        uiStore.initialiseBlockData(scheduleStore.blockCount);
    } else {
        uiStore.stopEditing();
    }
};

const isEquivalentArray = (a: number[], b: number[]) => {
    return (
        a.length === b.length && a.every((value, index) => value === b[index])
    );
};

const hasChanges = computed(() => {
    if (!uiStore.isJoining) {
        return !isEquivalentArray(
            uiStore.currentEntry,
            scheduleStore.entries[uiStore.userName]
        );
    } else {
        return !uiStore.isInitialData;
    }
});
</script>

<style scoped>
.container {
    padding: 8px;
}

.schedule-title {
    font-size: 1.6em;
    font-weight: bold;
}
</style>
