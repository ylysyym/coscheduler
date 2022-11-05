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
                <div class="block-wrapper"></div>
                <div
                    class="block-wrapper labels"
                    v-for="label in columnLabels"
                    :key="label"
                >
                    {{ label }}
                </div>
                <template v-for="(arr, row) in grid" :key="row">
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
                </template>
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

const gap = computed(() => Math.max(blockSize.value / 8, 2));
const blockGap = computed(() => Math.floor(gap.value / 2) + 'px');
</script>

<style scoped>
.container {
    display: inline-block;
    height: 100%;
    width: 100%;
}

.grid {
    display: grid;
    user-select: none;
    grid-template-columns: min-content repeat(
            v-bind(columns),
            v-bind(blockSize + 'px')
        );
    grid-auto-rows: v-bind(blockSize + 'px');
    gap: v-bind(blockGap);
}

.block-wrapper {
    white-space: nowrap;
}

.labels {
    text-align: center;
    align-self: center;
    padding: 8px;
}

.isSelected {
    background: rgb(121, 83, 235);
    margin: 0;
    filter: brightness(0.85);
    outline: v-bind(blockGap + ' solid rgb(121, 83, 230)');
}
</style>
