<template>
    <n-tooltip v-for="[level, value] in entryStats" :key="level">
        <template #trigger>
            <div
                class="bar-block"
                :style="{
                    background: scheduleStore.levels[level].color,
                    width: (value / scheduleStore.blockCount) * barWidth + 'px',
                }"
            >
                &nbsp;
            </div>
        </template>
        {{ scheduleStore.levels[level].label }} ({{ value }})
    </n-tooltip>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NTooltip } from 'naive-ui';
import { useScheduleStore } from '@/stores/schedule';

const props = defineProps<{
    person: string;
}>();

const scheduleStore = useScheduleStore();

const barWidth = ref(200);

const entries = computed(() => scheduleStore.entries[props.person]);

const entryStats = computed((): Map<number, number> => {
    const map = new Map();

    for (let i = scheduleStore.levels.length - 1; i >= 0; i--) {
        map.set(i, 0);
    }

    for (const level of entries.value) {
        map.set(level, map.get(level) + 1);
    }

    map.forEach((value, key) => {
        if (value === 0) {
            map.delete(key);
        }
    });

    return map;
});
</script>

<style scoped>
.bar-block {
    cursor: pointer;
    display: inline-block;
}
</style>
