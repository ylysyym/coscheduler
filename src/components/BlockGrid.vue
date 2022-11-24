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
                <template
                    v-for="[label, bounds] in dateLabelRowBounds"
                    :key="label"
                >
                    <div
                        class="label date-label"
                        :style="
                            'grid-row: ' + bounds.start + ' / ' + bounds.end
                        "
                    >
                        {{ label }}
                    </div>
                </template>
                <template v-for="(row, rowIndex) in grid" :key="rowIndex">
                    <div class="label time-label">
                        {{ timeLabels[rowIndex] }}
                    </div>
                    <template v-for="index in row" :key="index">
                        <SquareBlock
                            v-if="index >= 0"
                            class="selectable"
                            @click.self="selectBlock(index, $event)"
                            :size="blockSize"
                            :data-key="index"
                            :id="index"
                        />
                        <div v-else></div>
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
    rowDuration,
    generateGrid,
    rowStartTimes,
} from '@/utilities/generateGrid';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const container = ref();

const { width } = useElementSize(container);

const popover = ref<InstanceType<typeof BlockDetailPopover>>();

const blockSize = computed(() => {
    return Math.max(Math.floor(width.value / (columnCount.value + 5)), 15);
});

const rowDurationMinutes = computed(() =>
    rowDuration(scheduleStore.blockDuration)
);

const columnCount = computed(() => {
    return rowDurationMinutes.value / scheduleStore.blockDuration;
});

const grid = computed(() => {
    return generateGrid(
        scheduleStore.startTime,
        scheduleStore.blockCount,
        scheduleStore.blockDuration,
        rowDurationMinutes.value,
        columnCount.value
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

const rowTimes = computed(() => {
    return rowStartTimes(
        rowDurationMinutes.value,
        scheduleStore.startTime,
        scheduleStore.blockDuration,
        grid.value.length
    );
});

const dateLabels = computed(() => {
    // TODO: allow changing format
    return rowTimes.value.map((date) => date.toFormat('dd LLL'));
});

const timeLabels = computed(() => {
    return rowTimes.value.map((date) => date.toFormat('HH:mm'));
});

const dateLabelRowBounds = computed(() => {
    const result = new Map<string, { start: number; end: number }>();
    let start = 1;
    for (let i = 1; i <= dateLabels.value.length; i++) {
        if (
            i === dateLabels.value.length ||
            dateLabels.value[i] !== dateLabels.value[i - 1]
        ) {
            result.set(dateLabels.value[i - 1], {
                start,
                end: i + 1,
            });
            start = i + 1;
        }
    }
    return result;
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
    padding: 4px;
    width: 100%;
}

.grid {
    display: grid;
    user-select: none;
    grid-template-columns: min-content min-content repeat(
            v-bind(columnCount),
            v-bind(blockSize + 'px')
        );
    grid-auto-rows: v-bind(blockSize + 'px');
    gap: v-bind(blockGap);
}

.label {
    align-items: center;
    display: flex;
    height: 100%;
    padding: 0 8px;
    text-align: right;
    white-space: nowrap;
}

.date-label {
    background: #ddd;
}

.time-label {
    background: #eee;
}

.isSelected {
    filter: brightness(0.85);
    outline: v-bind(blockGap + ' solid rgb(121, 83, 230)');
}
</style>
