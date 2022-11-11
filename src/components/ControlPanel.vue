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
                <h3 v-if="people.length > 0">People</h3>
                <span v-else>There's no one here!</span>
                <n-space :vertical="!isSmallScreen">
                    <n-checkbox-group v-model:value="uiStore.selectedNames">
                        <n-space :vertical="!isSmallScreen">
                            <template v-for="person in people" :key="person">
                                <n-popover
                                    trigger="click"
                                    :show="showPersonPopover[person]"
                                    @clickoutside="
                                        showPersonPopover[person] = false
                                    "
                                >
                                    <template #trigger>
                                        <n-button
                                            @click="
                                                showPersonPopover[person] = true
                                            "
                                            tertiary
                                            :class="{
                                                struckout: !isChecked[person],
                                            }"
                                        >
                                            {{ person }}
                                        </n-button>
                                    </template>
                                    <n-space vertical>
                                        <div class="person-header">
                                            <strong>
                                                {{ person }}
                                            </strong>
                                            &nbsp;
                                            <n-checkbox
                                                :value="person"
                                                :disabled="uiStore.isEditing"
                                            >
                                                Show
                                            </n-checkbox>
                                        </div>
                                        <PersonStats :person="person" />
                                        <n-button
                                            :disabled="uiStore.isEditing"
                                            type="primary"
                                            @click="startEditing(person)"
                                        >
                                            Edit
                                        </n-button>
                                    </n-space>
                                </n-popover>
                            </template>
                        </n-space>
                    </n-checkbox-group>
                </n-space>
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
import {
    NButton,
    NCheckbox,
    NCheckboxGroup,
    NPopover,
    NSpace,
    NTabs,
    NTabPane,
    useDialog,
} from 'naive-ui';
import { computed, ref } from 'vue';
import { isSmallScreen } from '@/utilities/breakpoints';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import PersonStats from '@/components/PersonStats.vue';
import EditPanel from '@/components/EditPanel.vue';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const dialog = useDialog();

let people = computed(() => scheduleStore.people);
let showPersonPopover = ref<{ [person: string]: boolean }>({});

type CheckedNameMap = { [name: string]: boolean };
let isChecked = computed(() => {
    return uiStore.selectedNames.reduce(
        (result: CheckedNameMap, name: string) => {
            result[name] = true;
            return result;
        },
        {}
    );
});

const activeTab = computed(() => (uiStore.isEditing ? 'edit' : 'view'));

const isEditingExistingUser = computed(() => {
    return uiStore.isEditing && !uiStore.isJoining;
});

const startEditing = (person: string) => {
    if (uiStore.isEditing) return;

    uiStore.isEditing = true;
    uiStore.isJoining = false;
    uiStore.userName = person;
    uiStore.currentEntry = scheduleStore.entries[person].slice();
    showPersonPopover.value[person] = false;
};

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

.struckout {
    text-decoration: line-through;
}

.person-header {
    display: flex;
    justify-content: space-between;
}

.schedule-title {
    font-size: 1.6em;
    font-weight: bold;
}
</style>
