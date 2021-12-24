<template>
    <div v-if="hasSelectedItem">
        <div>{{ id }}</div>
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
const id = computed(() => store.selectedItem);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const selectedLevel = computed({
    get: () => gridState.level(id.value).level,
    set: (value: number) => {
        gridState.changeLevel(id.value, value);
    },
});

const gridState = useGridStateStore();

const levels = computed((): number[] => {
    return Array.from({ length: gridState.maxLevel }, (value, index) => index + 1);
});

const interval = computed(() => gridState.blockData[id.value].interval);
</script>

<style scoped></style>
