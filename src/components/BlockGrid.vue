<template>
    <div class="container" ref="container">
        <component
            :is="appStore.isEditing ? SelectionArea : 'div'"
            :on-move="onMove"
            :on-start="onStart"
            :options="{
                selectables: '.selectable',
            }"
        >
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
                            class="block-wrapper selectable"
                            :class="{
                                isSelected: appStore.selectedItems.has(index),
                            }"
                            :size="blockSize"
                            :data-key="index"
                            :data="blockData(index)"
                        />
                        <div class="block-wrapper" v-else></div>
                    </template>
                </div>
            </div>
        </component>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { SelectionArea, SelectionEvent } from '@viselect/vue';
import { useElementSize } from '@vueuse/core';
import SquareBlock from '@/components/SquareBlock.vue';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import {
    generateGrid,
    getColumnLabels,
    getRowLabels,
    TimeBreakpoint,
} from '@/utilities/generateGrid';

const container = ref(null);

const { width, height } = useElementSize(container);

const blockSize = computed(() => {
    return Math.floor(Math.min(width.value / 35, height.value / 9));
});

const appStore = useAppStore();

const store = useScheduleStore();

const columns = computed(() => {
    return store.rowUnit.minutes / store.blockUnit.minutes;
});
const grid = computed(() => {
    return generateGrid(
        store.startTime,
        store.endTime,
        store.blockUnit.minutes,
        TimeBreakpoint.Day,
        columns.value
    );
});

const blockIds = (els: Element[]): number[] => {
    return els.map((el) => el.getAttribute('data-key')).map(Number);
};

const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
        selection.clearSelection();
        appStore.clearSelection();
    }
};

const onMove = ({
    store: {
        changed: { added, removed },
    },
}: SelectionEvent) => {
    blockIds(added).forEach((id) => appStore.addSelection(id));
    blockIds(removed).forEach((id) => appStore.removeSelection(id));
};

const blockData = (index: number) => {
    if (appStore.isEditing) {
        return store.currentBlockAtIndex(appStore.selectedNames, index);
    }

    return store.blockAtIndex(appStore.selectedNames, index);
};

const columnLabels = computed(() => {
    return getColumnLabels(
        TimeBreakpoint.Day,
        columns.value,
        store.blockUnit.minutes
    );
});

const rowLabels = computed(() => {
    return getRowLabels(
        TimeBreakpoint.Day,
        store.startTime,
        columns.value,
        store.blockUnit.minutes,
        grid.value.length * grid.value[0].length
    );
});

const gap = computed(() => Math.floor(blockSize.value / 8));
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
    background: #a28fee;
    margin: 0;
}
</style>
