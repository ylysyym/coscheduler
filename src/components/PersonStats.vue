<template>
    <div>
        <n-tooltip v-for="[level, value] in entriesStats" :key="level">
            <template #trigger>
                <div
                    class="bar-block"
                    :style="{
                        background: scheduleStore.levels[level].color,
                        width: (value / scheduleStore.blockCount) * 200 + 'px',
                    }"
                >
                    &nbsp;
                </div>
            </template>
            {{ scheduleStore.levels[level].label }} ({{ value }})
        </n-tooltip>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NTooltip } from 'naive-ui';
import { useScheduleStore } from '@/stores/schedule';

const props = defineProps<{
    person: string;
}>();

const scheduleStore = useScheduleStore();

let entries = computed(() => scheduleStore.entries[props.person]);

let entriesStats = computed((): Map<number, number> => {
    let map = new Map();

    for (let i = scheduleStore.levels.length - 1; i >= 0; i--) {
        map.set(i, 0);
    }

    for (let level of entries.value) {
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
