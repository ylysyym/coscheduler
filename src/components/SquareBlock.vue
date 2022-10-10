<template>
    <div v-if="!store.isEditing">
        <n-popover trigger="click">
            <template #trigger>
                <div class="block" @click="selectBlock"></div>
            </template>
            <div v-for="(level, i) in levels" :key="i">
                {{ level.label }}
            </div>
        </n-popover>
    </div>
    <div v-else>
        <div class="block" @click="selectBlock"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NPopover } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';

const props = defineProps<{
    id: number;
    levels: AvailabilityLevel[];
    size: number;
}>();

const background = computed(() => {
    let result = 'linear-gradient(to bottom right';
    let n = 100 / props.levels.length;
    let sorted = props.levels;
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

const store = useAppStore();

const selectBlock = () => {
    store.selectItem(props.id);
};
</script>

<style scoped>
.block {
    background: v-bind(background);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
