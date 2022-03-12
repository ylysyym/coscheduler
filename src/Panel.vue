<template>
    <div class="container" v-if="hasSelectedItem">
        <div v-if="hasMultipleSelectedItems">{{ JSON.stringify(ids) }}</div>
        <div v-else>{{ ids[0] }}</div>
        <div>
            <select v-model="selectedLevel">
                <option v-for="level in levels" :value="level">
                    {{ level }}
                </option>
            </select>
        </div>
        <div>
            <span class="interval-display">
                {{ intervalString }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { useAppStore } from "./stores/app";
import { useGridStateStore } from "./stores/gridState";

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
    return Array.from({ length: gridState.maxLevel }, (value, index) => index + 1);
});

const intervalString = computed(() => {
    // TODO: consecutive intervals should be merged and shown as one
    let result = "";
    for (const id of ids.value) {
        const interval = gridState.blockData[id].interval;
        result += interval.start.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
        result += " ~ ";
        result += interval.end.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
        result += "\n";
    }

    return result;
});
</script>

<style scoped>
.container {
    display: inline-block;
}

.interval-display {
    white-space: pre;
}
</style>
