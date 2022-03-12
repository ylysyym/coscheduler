<template>
    <div class="container" v-if="hasSelectedItem">
        <div v-if="hasMultipleSelectedItems">Multiple items</div>
        <div v-else>{{ id }}</div>
        <div>
            <select v-model="selectedLevel">
                <option v-for="level in levels" :value="level">
                    {{ level }}
                </option>
            </select>
        </div>
        <div>
            <span>
                {{ interval.start.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY) }}
            </span>
            <span> ~ </span>
            <span>
                {{ interval.end.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY) }}
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
const id = computed(() => store.selectedItems[0] ?? 0);
const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasMultipleSelectedItems = computed(() => store.selectedItems.length > 1);
const selectedLevel = computed({
    get: () => {
        if (hasMultipleSelectedItems.value) {
            return -1; // TODO: should return the majority value
        } else {
            return gridState.level(id.value).level;
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

const interval = computed(() => gridState.blockData[id.value].interval);
</script>

<style scoped>
.container {
    display: inline-block;
}
</style>
