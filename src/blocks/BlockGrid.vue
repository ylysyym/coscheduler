<template>
    <GlobalEvents @mouseup="onGlobalMouseUp" @blur="onGlobalBlur" />
    <div class="container" ref="container">
        <div class="grid">
            <div class="row labels">
                <div class="block-wrapper"></div>
                <div
                    class="block-wrapper"
                    v-for="label in columnLabels"
                    :key="label"
                >
                    {{ label }}
                </div>
            </div>
            <div class="row" v-for="(label, row) in rowLabels" :key="row">
                <div class="block-wrapper labels">
                    {{ label }}
                </div>
                <SquareBlock
                    class="block-wrapper"
                    :class="{
                        isSelected: isSelected(row * columns + column - 1),
                    }"
                    v-for="column in columns"
                    :id="row * columns + column - 1"
                    :key="column"
                    :size="blockSize"
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
import { computed, ref } from 'vue';
import { DateTime, Duration } from 'luxon';
import SquareBlock from '@/blocks/SquareBlock.vue';
import { useGridStateStore } from '@/stores/gridState';
import { AvailabilityLevel } from '@/AvailabilityLevel';
import { useAppStore } from '@/stores/app';
import { GlobalEvents } from 'vue-global-events';

const rows = ref(7);
const columns = ref(24);
const blockCount = computed(() => rows.value * columns.value);
const blockSize = computed(() => 35);
const gap = ref(5);

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

const appStore = useAppStore();

let startSquare = -1;
let isCurrentlySelecting = false;
let selectedSquares = ref([] as number[]);

const startSelecting = (index: number) => {
    isCurrentlySelecting = true;
    startSquare = index;
    selectedSquares.value = [index];
};

const stopSelecting = () => {
    isCurrentlySelecting = false;
};

const updateSelection = (a: number, b: number) => {
    selectedSquares.value = getSquaresBetween(a, b);
    appStore.selectItems(selectedSquares.value);
};

const onMouseDown = (index: number) => {
    startSelecting(index);
};

const onMouseUp = (index: number) => {
    if (!isCurrentlySelecting) return;
    stopSelecting();
    updateSelection(startSquare, index);
};

const onMouseOver = (index: number) => {
    if (!isCurrentlySelecting) return;
    updateSelection(startSquare, index);
};

const isSelected = (index: number) => {
    return selectedSquares.value.includes(index);
};

const onGlobalBlur = () => {
    stopSelecting();
};

const onGlobalMouseUp = () => {
    stopSelecting();
};

const currentDate = ref(
    DateTime.now().set({ minute: 0, second: 0, millisecond: 0 })
);
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
    return time.toFormat('HH');
};
const getRowLabel = (time: DateTime): string => {
    return time.toFormat('EEEE MMM dd');
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

const blockGap = computed(() => gap.value / 2 + 'px');
</script>

<style scoped>
.container {
    display: inline-block;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
}

.grid {
    display: table;
    user-select: none;
}

.row {
    display: table-row;
    line-height: 0;
}

.block-wrapper {
    display: table-cell;
    padding: v-bind(blockGap);
    white-space: nowrap;
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
