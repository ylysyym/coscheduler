<template>
    <div>
        <n-space vertical>
            <div>
                <strong>Name</strong>
                <n-input
                    placeholder="Name"
                    v-model:value="name"
                    :disabled="!appStore.isJoining"
                    autofocus
                />
            </div>
            <div v-if="appStore.hasSelectedItem">
                <div>
                    <strong>Selection</strong>
                    <n-ellipsis :line-clamp="3" style="width: 100%">
                        <div v-for="x in formattedSelectedIntervals" :key="x">
                            {{ x }}
                        </div>
                    </n-ellipsis>
                </div>
                <div>
                    <strong>Status</strong>
                    <n-space :vertical="!isSmallScreen" size="small">
                        <n-button
                            v-for="level in visibleLevels"
                            :key="level.level"
                            :value="level.level"
                            @click="changeLevel(level.level)"
                            :tertiary="level.level === selectedLevel"
                            :strong="level.level === selectedLevel"
                        >
                            <span :style="{ color: level.color }">●</span>
                            {{ level.label }}
                        </n-button>
                    </n-space>
                </div>
            </div>
            <div v-else>
                <div>Click a square to select it.</div>
                <div>Drag to select multiple squares.</div>
            </div>
            <n-button type="primary" @click="saveChanges">Save</n-button>
        </n-space>
    </div>
    <n-modal
        v-model:show="showAlert"
        :title="alertTitle"
        :content="alertMessage"
        type="error"
        preset="dialog"
        positive-text="OK"
    />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Interval } from 'luxon';
import { NButton, NEllipsis, NInput, NModal, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { isSmallScreen } from '@/utilities/breakpoints';
import { formatInterval } from '@/utilities/formatTimes';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

const mostSelectedLevel = computed(() => {
    const selectedLevels = Array.from(appStore.selectedItems).map(
        (id) => appStore.level(id).level
    );
    return selectedLevels
        .sort((a, b) => {
            return (
                selectedLevels.filter((v) => v === a).length -
                selectedLevels.filter((v) => v === b).length
            );
        })
        .pop();
});

const hasSingleSelectedItem = computed(() => appStore.selectedItems.size === 1);

const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return appStore.level(appStore.firstSelectedItem).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    appStore.changeSelectedLevels(level);
};

const visibleLevels = computed((): AvailabilityLevel[] => {
    return scheduleStore.scale.levels.filter((level) => level.hidden !== true);
});

const selectedIntervals = computed(() => {
    return Array.from(appStore.selectedItems).map(
        (id) => scheduleStore.intervals[id]
    );
});

const formattedSelectedIntervals = computed(() => {
    return Interval.merge(selectedIntervals.value).map((interval) =>
        formatInterval(interval)
    );
});

const name = ref(appStore.userName);

const showAlert = ref(false);
const alertTitle = ref();
const alertMessage = ref();

const saveChanges = () => {
    if (name.value.length <= 0) {
        alertMessage.value = "Name can't be empty";
        alertTitle.value = 'Invalid name';
        showAlert.value = true;
        return;
    }

    scheduleStore.entries[name.value] = appStore.currentEntry.slice();

    if (appStore.isJoining) {
        appStore.selectedNames.push(name.value);
    }

    appStore.stopEditing();
};
</script>
