<template>
    <div class="control-container">
        <div>
            <n-tabs
                type="segment"
                @update:value="changeTab"
                @before-leave="beforeChangeTab"
                :value="uiStore.selectedTab"
                default-value="view"
            >
                <n-tab name="view">View</n-tab>
                <n-tab name="edit">
                    {{ editTabLabel }}
                </n-tab>
                <n-tab name="share">Share</n-tab>
            </n-tabs>
        </div>
        <n-scrollbar>
            <div class="tab-pane">
                <ViewPanel v-if="uiStore.selectedTab === 'view'" />
                <ShareWidget v-else-if="uiStore.selectedTab === 'share'" />
                <EditPanel v-else-if="uiStore.selectedTab === 'edit'" />
            </div>
        </n-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NScrollbar, NTab, NTabs, useDialog } from 'naive-ui';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import EditPanel from '@/components/EditPanel.vue';
import ViewPanel from '@/components/ViewPanel.vue';
import ShareWidget from '@/components/ShareWidget.vue';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const dialog = useDialog();

const isEditingExistingUser = computed(() => {
    return uiStore.isEditing && !uiStore.isJoining;
});

const editTabLabel = computed(() => {
    return isEditingExistingUser.value ? 'Edit' : 'Join';
});

const beforeChangeTab = (newTabName: string, oldTabName: string) => {
    if (oldTabName === 'edit') {
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
    } else if (uiStore.isEditing) {
        uiStore.stopEditing();
    }

    uiStore.changeTab(tabName);
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
.control-container {
    display: flex;
    flex-flow: column;
    height: 100%;
}

.tab-pane {
    padding: 8px;
}
</style>
