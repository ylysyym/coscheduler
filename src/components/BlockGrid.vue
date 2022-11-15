<template>
    <div class="container" ref="container">
        <SelectionArea
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
                <template v-for="(row, rowIndex) in grid" :key="rowIndex">
                    <div class="block-wrapper labels">
                        {{ rowLabels[rowIndex] }}
                    </div>
                    <template v-for="index in row" :key="index">
                        <SquareBlock
                            v-if="index >= 0"
                            class="block-wrapper selectable"
                            @click="selectBlock(index, $event)"
                            :size="blockSize"
                            :data-key="index"
                            :id="index"
                        />
                        <div class="block-wrapper" v-else></div>
                    </template>
                </template>
            </div>
        </SelectionArea>
    </div>
    <BlockDetailPopover ref="popover" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { SelectionArea, SelectionEvent } from '@viselect/vue';
import { useElementSize } from '@vueuse/core';
import SquareBlock from '@/components/SquareBlock.vue';
import BlockDetailPopover from '@/components/BlockDetailPopover.vue';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import {
    generateGrid,
    getColumnLabels,
    getRowLabels,
    TimeBreakpoint,
} from '@/utilities/generateGrid';

const container = ref(null);
const popover = ref<InstanceType<typeof BlockDetailPopover>>();

const { width } = useElementSize(container);

const blockSize = computed(() => {
    return Math.max(Math.floor(width.value / (columns.value + 5)), 15);
});

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const columns = computed(() => {
    return scheduleStore.rowUnit.minutes / scheduleStore.blockDuration;
});

const grid = computed(() => {
    return generateGrid(
        scheduleStore.startTime,
        scheduleStore.endTime,
        scheduleStore.blockDuration,
        TimeBreakpoint.Day,
        columns.value
    );
});

const blockIds = (els: Element[]): number[] => {
    return els.map((el) => el.getAttribute('data-key')).map(Number);
};

const onStart = ({ event, selection }: SelectionEvent) => {
    if (!uiStore.isEditing) return;
    if (!event?.ctrlKey && !event?.metaKey) {
        selection.clearSelection();
        uiStore.clearSelection();
    }
};

const onMove = ({
    store: {
        changed: { added, removed },
    },
}: SelectionEvent) => {
    if (!uiStore.isEditing) return;
    blockIds(added).forEach((id) => uiStore.addSelection(id));
    blockIds(removed).forEach((id) => uiStore.removeSelection(id));
};

const columnLabels = computed(() => {
    return getColumnLabels(
        TimeBreakpoint.Day,
        columns.value,
        scheduleStore.blockDuration
    );
});

const rowLabels = computed(() => {
    return getRowLabels(
        TimeBreakpoint.Day,
        scheduleStore.startTime,
        columns.value,
        scheduleStore.blockDuration,
        grid.value.length * grid.value[0].length
    );
});

const gap = computed(() => Math.max(blockSize.value / 8, 2));
const blockGap = computed(() => Math.floor(gap.value / 2) + 'px');

const selectBlock = (id: number, e: MouseEvent) => {
    if (uiStore.isEditing) return;

    popover.value?.show(id, { x: e.x, y: e.y }, e.target as HTMLElement);
};
</script>

<style scoped>
.container {
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
    position: relative;
    white-space: nowrap;
}

.labels {
    text-align: center;
    align-self: center;
    padding: 8px;
}

.isSelected {
    filter: brightness(0.85);
    outline: v-bind(blockGap + ' solid rgb(121, 83, 230)');
}
</style>
