<template>
    <n-input
        placeholder="Name"
        v-model:value="name"
        :disabled="!appStore.isJoining"
    />
    <div class="container" v-if="hasSelectedItem">
        <n-space vertical>
            <div>
                <div
                    class="interval-display"
                    v-for="(str, i) in selectedIntervalStrings"
                    :key="i"
                >
                    {{ str }}
                </div>
            </div>
            <div>
                <n-space :vertical="!isSmallScreen" size="small">
                    <n-button
                        v-for="level in levels"
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
        </n-space>
    </div>
    <div v-else>
        Click a square to select it.
        <br />
        Drag to select multiple squares.
    </div>
    <n-button type="primary" @click="saveChanges">Save</n-button>
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
import { NButton, NInput, NModal, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { isSmallScreen } from '@/utilities/breakpoints';
import { formatInterval } from '@/utilities/formatTimes';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

const emit = defineEmits(['saveChanges']);

const ids = computed(() => appStore.selectedItems);
const hasSelectedItem = computed(() => appStore.hasSelectedItem);
const hasSingleSelectedItem = computed(() => appStore.selectedItems.size === 1);

const mostSelectedLevel = computed(() => {
    const selectedLevels = Array.from(ids.value).map((id) => {
        return scheduleStore.level(appStore.userName, id).level;
    });
    return selectedLevels
        .sort((a, b) => {
            return (
                selectedLevels.filter((v) => v === a).length -
                selectedLevels.filter((v) => v === b).length
            );
        })
        .pop();
});

const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return scheduleStore.level(
            appStore.userName,
            ids.value.values().next().value
        ).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    scheduleStore.changeMultipleLevels(appStore.userName, ids.value, level);
};

const levels = computed((): AvailabilityLevel[] => {
    return scheduleStore.scale.levels.filter((level) => level.hidden !== true);
});

const selectedIntervals = computed(() => {
    return Array.from(ids.value).map((id) => scheduleStore.intervals[id]);
});

const selectedIntervalStrings = computed(() => {
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

    if (appStore.isJoining) {
        scheduleStore.saveAs(name.value);
    }

    emit('saveChanges');
};
</script>

<style scoped>
.container {
    display: inline-block;
    height: 100%;
    overflow: hidden;
    width: 100%;
}
</style>
