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
                    <n-checkbox-group v-model:value="appStore.selectedNames">
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
                                                :disabled="appStore.isEditing"
                                            >
                                                Show
                                            </n-checkbox>
                                        </div>
                                        <PersonStats :person="person" />
                                        <n-button
                                            :disabled="appStore.isEditing"
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
                <EditPanel @save-changes="saveChanges" />
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
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import PersonStats from '@/components/PersonStats.vue';
import EditPanel from '@/components/EditPanel.vue';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

const dialog = useDialog();

let people = computed(() => scheduleStore.people);
let showPersonPopover = ref<{ [person: string]: boolean }>({});

type CheckedNameMap = { [name: string]: boolean };
let isChecked = computed(() => {
    return appStore.selectedNames.reduce(
        (result: CheckedNameMap, name: string) => {
            result[name] = true;
            return result;
        },
        {}
    );
});

const activeTab = computed(() => (appStore.isEditing ? 'edit' : 'view'));
const placeholderName = '';

const isEditingExistingUser = computed(() => {
    return (
        appStore.isEditing &&
        appStore.userName !== placeholderName &&
        scheduleStore.people.includes(appStore.userName)
    );
});

const startEditing = (person: string) => {
    if (appStore.isEditing) return;
    appStore.isEditing = true;
    appStore.isJoining = false;
    appStore.userName = person;
    appStore.selectedNames = [person];
    appStore.originalEntry = scheduleStore.entries[person].slice();
    showPersonPopover.value[person] = false;
};

const cancelEdit = () => {
    if (appStore.isJoining) {
        delete scheduleStore.entries[placeholderName];
    } else {
        scheduleStore.entries[appStore.userName] = appStore.originalEntry;
    }
    appStore.stopEditing();
    selectAllNames();
};

const selectAllNames = () => {
    appStore.selectedNames = Object.keys(scheduleStore.entries);
};

const saveChanges = () => {
    appStore.stopEditing();
    selectAllNames();
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
        appStore.joinAs(placeholderName);
        scheduleStore.initialiseBlockData(placeholderName);
    } else {
        cancelEdit();
    }
};

const isEquivalentArray = (a: number[], b: number[]) => {
    return (
        a.length === b.length && a.every((value, index) => value === b[index])
    );
};

const hasChanges = computed(() => {
    if (!appStore.isJoining) {
        return !isEquivalentArray(
            appStore.originalEntry,
            scheduleStore.entries[appStore.userName]
        );
    } else {
        return !scheduleStore.isInitialData(appStore.userName);
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
