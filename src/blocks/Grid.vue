<template>
    <div class="container">
        <div class="row labels">
            <div class="block"></div>
            <div class="block" v-for="label in columnLabels">
                {{ label }}
            </div>
        </div>
        <div class="row" v-for="(label, row) in rowLabels" :key="row">
            <div class="block labels">
                {{ label }}
            </div>
            <SquareBlock
                class="block"
                v-for="column in columns"
                :id="row * columns + column - 1"
                :key="column"
                :size="blockSize"
                :style="style"
                :level="levels(row * columns + column - 1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime, Duration } from "luxon";
import SquareBlock from "@/blocks/SquareBlock.vue";
import { useGridStateStore } from "@/stores/gridState";
import { AvailabilityLevel } from "@/AvailabilityLevel";

const rows = ref(7);
const columns = ref(24);
const blockCount = computed(() => rows.value * columns.value);

const blockSize = ref(35);
const gap = ref(5);

const currentDate = ref(DateTime.now());
const startDate = (): DateTime => {
    return currentDate.value;
};
const store = useGridStateStore();
const levels = (index: number): AvailabilityLevel => store.level(index);
const defaultDuration: Duration = Duration.fromObject({
    hours: 1,
});

const duration = computed(() => defaultDuration);
store.initialiseBlockData(blockCount.value, startDate(), duration.value);
const getColumnLabel = (time: DateTime): string => {
    return time.toFormat("HH");
};
const getRowLabel = (time: DateTime): string => {
    return time.toFormat("EEEE MMM dd");
};
const columnLabels = computed(() => {
    let labels = [];
    for (let i = 0; i < columns.value; i++) {
        labels.push(getColumnLabel(store.blockData[i].interval.start));
    }
    return labels;
});
const rowLabels = computed(() => {
    let labels = [];
    for (let i = 0; i < blockCount.value; i += columns.value) {
        labels.push(getRowLabel(store.blockData[i].interval.start));
    }
    return labels;
});

const style = computed(() => {
    return {
        "--blockGap": gap.value / 2 + "px",
    };
});
</script>

<style scoped>
.container {
    display: table;
}

.row {
    display: table-row;
    line-height: 0;
}

.block {
    display: table-cell;
    padding: var(--blockGap);
}

.labels.row {
    line-height: normal;
    text-align: center;
}
</style>
