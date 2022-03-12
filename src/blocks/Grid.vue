<template>
    <div class="container">
        <div class="grid">
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
                    :class="{ isSelected: isSelected(row * columns + column - 1) }"
                    v-for="column in columns"
                    :id="row * columns + column - 1"
                    :key="column"
                    :size="blockSize"
                    :style="style"
                    :level="levels(row * columns + column - 1)"
                    @mousedown="onMouseDown(row * columns + column - 1)"
                    @mouseover="onMouseOver(row * columns + column - 1)"
                    @mouseup="onMouseUp(row * columns + column - 1)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime, Duration } from "luxon";
import SquareBlock from "@/blocks/SquareBlock.vue";
import { useGridStateStore } from "@/stores/gridState";
import { AvailabilityLevel } from "@/AvailabilityLevel";
import { useAppStore } from "@/stores/app";

const rows = ref(7);
const columns = ref(24);
const blockCount = computed(() => rows.value * columns.value);

const blockSize = ref(35);
const gap = ref(5);

let currentSquare = -1;
let selectedSquares = ref([] as number[]);

const getIndexFromCoordinates = (col: number, row: number): number => {
    return row * columns.value + col - 1;
};

const getCoordinatesFromIndex = (index: number): [number, number] => {
    const col = (index % columns.value) + 1;
    const row = Math.floor(index / columns.value);

    return [col, row];
};

const getSquaresBetween = (a: number, b: number): number[] => {
    const [colA, rowA] = getCoordinatesFromIndex(a);
    const [colB, rowB] = getCoordinatesFromIndex(b);
    let result: number[] = [];

    for (let y = Math.min(rowA, rowB); y <= Math.max(rowA, rowB); y++) {
        for (let x = Math.min(colA, colB); x <= Math.max(colA, colB); x++) {
            result.push(getIndexFromCoordinates(x, y));
        }
    }

    return result;
};

const onMouseDown = (index: number) => {
    currentSquare = index;
};

const appStore = useAppStore();

const onMouseUp = (index: number) => {
    selectedSquares.value = getSquaresBetween(currentSquare, index);
    appStore.selectItems(selectedSquares.value);
    currentSquare = -1;
};

const onMouseOver = (index: number) => {
    if (currentSquare === -1) return;
    selectedSquares.value = getSquaresBetween(currentSquare, index);
};

const isSelected = (index: number) => {
    return selectedSquares.value.includes(index);
};

const currentDate = ref(DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }));
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
    display: inline-block;
}

.grid {
    display: table;
    user-select: none;
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

.isSelected {
    background: #b3b1d8;
    margin: 0;
}
</style>
