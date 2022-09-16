<template>
    <div class="container" v-if="hasSelectedItem">
        <div v-if="hasMultipleSelectedItems">{{ JSON.stringify(ids) }}</div>
        <div v-else>{{ ids[0] }}</div>
        <div>
            <select v-model="selectedLevel">
                <option v-for="level in levels" :value="level" :key="level">
                    {{ levelLabels[level - 1] }}
                </option>
            </select>
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
import { useAppStore } from './stores/app';
import { useGridStateStore } from './stores/gridState';

const store = useAppStore();
const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasSingleSelectedItem = computed(() => store.selectedItems.length === 1);
const hasMultipleSelectedItems = computed(() => store.selectedItems.length > 1);
const selectedLevel = computed({
    get: () => {
        if (hasSingleSelectedItem.value) {
            return gridState.level(ids.value[0]).level;
        } else {
            return -1; // TODO: should return the majority value
        }
    },
    set: (value: number) => {
        gridState.changeMultipleLevels(ids.value, value);
    },
});

const gridState = useGridStateStore();

const levels = computed((): number[] => {
    return Array.from(
        { length: gridState.scale.levels },
        (value, index) => index + 1
    );
});

const levelLabels = computed((): string[] => {
    return levels.value.map((level) => {
        return gridState.scale.label(level);
    });
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

.interval-display {
    white-space: pre;
}
</style>
