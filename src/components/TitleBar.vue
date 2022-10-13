<template>
    <div>
        <n-space>
            <span class="schedule-title">{{ scheduleStore.title }}</span>
            <n-button
                type="primary"
                v-if="!appStore.isEditing"
                @click="$emit('showJoinDialog')"
            >
                Join
            </n-button>
        </n-space>
        <n-space class="status">
            <template v-if="appStore.isEditing">
                {{ editingMessage }}
                <n-button @click="cancelEdit">Cancel</n-button>
                <n-button type="primary" @click="stopEditing"> Save </n-button>
            </template>
            <template v-else>Viewing schedule</template>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { computed } from 'vue';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

const selectAllNames = () => {
    appStore.selectedNames = Object.keys(scheduleStore.entries);
};

const cancelEdit = () => {
    if (appStore.isJoining) {
        delete scheduleStore.entries[appStore.userName];
        appStore.userName = '';
    } else {
        // TODO: some way to restore pre-edit state
    }
    appStore.stopEditing();
    selectAllNames();
};

const stopEditing = () => {
    // TODO: save changes remotely at this point
    appStore.stopEditing();
    selectAllNames();
};

let editingMessage = computed(() => {
    if (appStore.isJoining) {
        return `Joining as ${appStore.userName}`;
    }

    return `Editing ${appStore.userName}'s schedule`;
});

defineEmits(['showJoinDialog']);
</script>

<style scoped>
.schedule-title {
    font-size: 1.6em;
    font-weight: bold;
}

.status {
    font-size: 1.4em;
}
</style>
