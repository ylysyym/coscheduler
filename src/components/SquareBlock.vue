<template>
    <div
        class="block"
        :class="{
            isSelected: isSelected,
            isHovered: isHovered,
        }"
    ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BlockData } from '@/models/BlockData';
import { useScheduleStore } from '@/stores/schedule';
import { useSettingsStore } from '@/stores/settings';
import { useUiStore } from '@/stores/ui';

const props = defineProps<{
    id: number;
    size: number;
}>();

const uiStore = useUiStore();
const settingsStore = useSettingsStore();
const scheduleStore = useScheduleStore();

const data = computed<BlockData>(() => {
    if (uiStore.isEditing) {
        // TODO: make this less ugly / more clear
        return {
            interval: scheduleStore.intervals[props.id],
            entries: {
                '': scheduleStore.levels[uiStore.currentEntry[props.id]],
            },
        };
    } else {
        return scheduleStore.blockAtIndex(uiStore.selectedNames, props.id);
    }
});

const unknownColor = '#ddd'; // TODO: switch in dark mode

const background = computed(() => {
    if (Object.keys(data.value.entries).length === 0) {
        return unknownColor;
    }

    let gradientType = '';
    let gradientParameter = '';

    if (settingsStore.orientation === 'conic') {
        gradientType = 'conic';
        gradientParameter = 'at center';
    } else {
        gradientType = 'linear';
        gradientParameter = 'to ' + settingsStore.orientation;
    }

    let result = `${gradientType}-gradient(${gradientParameter}`;
    const n = 100 / Object.keys(data.value.entries).length;
    let sorted = Object.values(data.value.entries);
    sorted.sort((a, b) => b.level - a.level);
    for (let i = 0; i < sorted.length; i++) {
        result += `, ${sorted[i].color} ${i * n}%, ${sorted[i].color} ${
            (i + 1) * n
        }%`;
    }
    result += ')';
    return result;
});
const size = computed(() => props.size + 'px');

const isSelected = computed(() => uiStore.selectedItems.has(props.id));
const isHovered = computed(() => uiStore.hoveredItem === props.id);
</script>

<style scoped>
.block {
    background: v-bind(background);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
