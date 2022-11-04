<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Interval } from 'luxon';
import { NButton, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { isSmallScreen } from '@/utilities/breakpoints';
import { formatInterval } from '@/utilities/formatTimes';

const store = useAppStore();
const scheduleStore = useScheduleStore();

const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasSingleSelectedItem = computed(() => store.selectedItems.size === 1);

const mostSelectedLevel = computed(() => {
    const selectedLevels = Array.from(ids.value).map((id) => {
        return scheduleStore.level(store.userName, id).level;
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
            store.userName,
            ids.value.values().next().value
        ).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    scheduleStore.changeMultipleLevels(store.userName, ids.value, level);
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
</script>

<style scoped>
.container {
    display: inline-block;
    height: 100%;
    overflow: hidden;
    width: 100%;
}
</style>
