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
                    <template v-for="(id, colIndex) in row" :key="colIndex">
                        <SquareBlock
                            v-if="id >= 0"
                            class="selectable"
                            @mouseover.self="selectBlock(id, colIndex, $event)"
                            @mouseleave="unselect"
                            :size="blockSize"
                            :data-key="id"
                            :id="id"
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
import { useDebounceFn, useElementSize } from '@vueuse/core';
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

const showPopover = useDebounceFn((id: number, col: number, e: MouseEvent) => {
    if (!uiStore.isHovering) return;

    const isLeftHalf = col % columnCount.value < columnCount.value / 2;
    const el = e.target as HTMLElement;
    const rect = el.getBoundingClientRect();

    popover.value?.show(
        id,
        {
            x: isLeftHalf ? rect.right : rect.left,
            y: rect.top + (rect.bottom - rect.top) / 2,
        },
        isLeftHalf
    );
}, 100);

const selectBlock = (id: number, col: number, e: MouseEvent) => {
    uiStore.hoverItem(id);
    showPopover(id, col, e);
};

const unselect = () => {
    uiStore.unhover();
    popover.value?.hide();
};
</script>

<style scoped>
.container {
    padding: 4px;
    user-select: none;
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

.isHovered {
    filter: brightness(0.7);
}
</style>
