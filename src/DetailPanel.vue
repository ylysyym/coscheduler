<template>
    <div class="container" v-if="hasSelectedItem">
        <div v-if="hasMultipleSelectedItems">{{ JSON.stringify(ids) }}</div>
        <div v-else>{{ ids[0] }}</div>
        <div>
            <n-radio-group
                :value="selectedLevel"
                @update:value="changeLevel($event)"
            >
                <n-radio-button
                    v-for="level in levels"
                    :key="level.level"
                    :label="level.label"
                    :value="level.level"
                >
                    {{ level.label }}
                    <span :style="{ color: level.color }">●</span>
                </n-radio-button>
            </n-radio-group>
        </div>
        <div>
            <span class="interval-display">
                {{ intervalString }}
            </span>
        </div>
    </div>
    <div class="container" v-else>Nothing selected.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DateTime, Interval } from 'luxon';
import { NRadioGroup, NRadioButton } from 'naive-ui';
import { useAppStore } from './stores/app';
import { useGridStateStore } from './stores/gridState';
import { AvailabilityLevel } from './AvailabilityLevel';

const store = useAppStore();
const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasSingleSelectedItem = computed(() => store.selectedItems.length === 1);
const hasMultipleSelectedItems = computed(() => store.selectedItems.length > 1);
const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return gridState.level(ids.value[0]).level;
    } else {
        return -1; // TODO: should return the majority value
    }
});

const changeLevel = (level: number) => {
    gridState.changeMultipleLevels(ids.value, level - 1);
};

const gridState = useGridStateStore();

const levels = computed((): AvailabilityLevel[] => {
    return gridState.scale.levels;
});

const intervalString = computed(() => {
    let result = '';
    let intervals: Interval[] = [];
    for (const id of ids.value) {
        intervals.push(gridState.blockData[id].interval);
    }
    let mergedIntervals = Interval.merge(intervals);
    for (const interval of mergedIntervals) {
        result += interval.start.toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        result += ' ~ ';
        result += interval.end.toLocaleString(
            DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        result += '\n';
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

.selected-level {
    border: 3px solid black;
}

.interval-display {
    white-space: pre;
}
</style>
