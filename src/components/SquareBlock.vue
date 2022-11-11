<template>
    <div
        class="block"
        :class="{
            isSelected: isSelected,
        }"
    ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BlockData } from '@/models/BlockData';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import { useSettingsStore } from '@/stores/settings';

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
        return new BlockData(scheduleStore.intervals[props.id], {
            '': scheduleStore.scale.levels[uiStore.currentEntry[props.id]],
        });
    } else {
        return scheduleStore.blockAtIndex(uiStore.selectedNames, props.id);
    }
});

const background = computed(() => {
    if (Object.keys(data.value.entries).length === 0) {
        return scheduleStore.scale.levels[0].color;
    }

    let result = 'linear-gradient(to ' + settingsStore.orientation;
    let n = 100 / Object.keys(data.value.entries).length;
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
</script>

<style scoped>
.block {
    background: v-bind(background);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
