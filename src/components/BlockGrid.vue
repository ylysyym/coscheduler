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
            <div class="row" v-for="(arr, row) in grid" :key="row">
                <div class="block-wrapper labels">
                    {{ rowLabels[row] }}
                </div>
                <template v-for="(index, col) in arr" :key="col">
                    <SquareBlock
                        v-if="index >= 0"
                        class="block-wrapper"
                        :class="{
                            isSelected: isSelected(index),
                        }"
                        :id="index"
                        :size="blockSize"
                        :levels="levels(index)"
                        @mousedown="onMouseDown(index)"
                        @mouseover="onMouseOver(index)"
                        @mouseup="onMouseUp(index)"
                    />
                    <div class="block-wrapper" v-else></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { useElementSize } from '@vueuse/core';
import SquareBlock from '@/components/SquareBlock.vue';
import { useGridStateStore } from '@/stores/gridState';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { useAppStore } from '@/stores/app';
import {
    generateGrid,
    getColumnLabels,
    getRowLabels,
    TimeBreakpoint,
} from '@/utilities/GridGenerator';

const container = ref(null);

const { width, height } = useElementSize(container);

const blockSize = computed(() => {
    return Math.min(width.value / 35, height.value / 9);
});

const gap = computed(() => Math.floor(blockSize.value / 6));

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

const store = useGridStateStore();

const columns = computed(() => {
    return store.display / store.units;
});
const grid = computed(() => {
    return generateGrid(
        store.startTime,
        store.endTime,
        store.units,
        TimeBreakpoint.Day,
        columns.value
    );
});

const getIndexFromCoordinates = (col: number, row: number): number => {
    return grid.value[row][col];
};

const getCoordinatesFromIndex = (index: number): [number, number] => {
    for (let i = 0; i < grid.value.length; i++) {
        let colIndex = grid.value[i].indexOf(index);
        if (colIndex > -1) {
            return [colIndex, i];
        }
    }

    return [-1, -1];
};

const getSquaresBetween = (a: number, b: number): number[] => {
    const [colA, rowA] = getCoordinatesFromIndex(a);
    const [colB, rowB] = getCoordinatesFromIndex(b);
    let result: number[] = [];

    for (let y = Math.min(rowA, rowB); y <= Math.max(rowA, rowB); y++) {
        for (let x = Math.min(colA, colB); x <= Math.max(colA, colB); x++) {
            const index = getIndexFromCoordinates(x, y);
            if (index >= 0) {
                result.push(index);
            }
        }
    }

    return result;
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

const levels = (index: number): AvailabilityLevel[] => store.levels(index);

const columnLabels = computed(() => {
    return getColumnLabels(TimeBreakpoint.Day, columns.value, store.units);
});

const rowLabels = computed(() => {
    return getRowLabels(
        TimeBreakpoint.Day,
        store.startTime,
        columns.value,
        store.units,
        grid.value.length * grid.value[0].length
    );
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
