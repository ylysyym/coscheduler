<template>
    <div class="container" v-if="hasSelectedItem">
        <div>
            <n-radio-group :value="selectedLevel" @update:value="changeLevel">
                <n-radio-button
                    v-for="level in levels"
                    :key="level.level"
                    :label="level.label"
                    :value="level.level"
                    @click="changeLevel(level.level)"
                >
                    {{ level.label }}
                    <span :style="{ color: level.color }">●</span>
                </n-radio-button>
            </n-radio-group>
        </div>
        <div>
            <div
                class="interval-display"
                v-for="(str, i) in selectedIntervalStrings"
                :key="i"
            >
                {{ str }}
            </div>
        </div>
    </div>
    <div class="container" v-else>Nothing selected.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DateTime, Interval } from 'luxon';
import { NRadioGroup, NRadioButton } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';

const store = useAppStore();
const scheduleStore = useScheduleStore();
const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasSingleSelectedItem = computed(() => store.selectedItems.length === 1);

const mostSelectedLevel = computed(() => {
    const arr = ids.value.map((id) => {
        return scheduleStore.currentLevel(id).level;
    });
    return arr
        .sort((a, b) => {
            return (
                arr.filter((v) => v === a).length -
                arr.filter((v) => v === b).length
            );
        })
        .pop();
});

const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return scheduleStore.currentLevel(ids.value[0]).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    scheduleStore.changeMultipleLevels(ids.value, level);
};

const levels = computed((): AvailabilityLevel[] => {
    return scheduleStore.scale.levels;
});

const selectedIntervalStrings = computed(() => {
    let result = [];
    let intervals: Interval[] = [];
    for (const id of ids.value) {
        intervals.push(scheduleStore.currentEntry[id].interval);
    }
    let mergedIntervals = Interval.merge(intervals);
    for (const interval of mergedIntervals) {
        let intervalString = '';
        intervalString += interval.start.toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        intervalString += ' ~ ';
        intervalString += interval.end.toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        result.push(intervalString);
    }

    return result;
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
