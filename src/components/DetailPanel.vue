<template>
    <div class="container" v-if="hasSelectedItem">
        <n-space vertical>
            <div>
                <div
                    class="interval-display"
                    v-for="(str, i) in selectedIntervalStrings"
                    :key="i"
                >
                    {{ str }}
                </div>
            </div>
            <div>
                <n-radio-group
                    :value="selectedLevel"
                    @update:value="changeLevel"
                >
                    <n-radio-button
                        v-for="level in levels"
                        :key="level.level"
                        :label="level.label"
                        :value="level.level"
                        @click="changeLevel(level.level)"
                    >
                        {{ level.label }}
                        <span :style="{ color: level.color }">●</span>
                    </n-radio-button>
                </n-radio-group>
            </div>
        </n-space>
    </div>
    <div class="container" v-else></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DateTime, Interval } from 'luxon';
import { NRadioButton, NRadioGroup, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';

const store = useAppStore();
const scheduleStore = useScheduleStore();
const ids = computed(() => store.selectedItems);
const hasSelectedItem = computed(() => store.hasSelectedItem);
const hasSingleSelectedItem = computed(() => store.selectedItems.length === 1);

const mostSelectedLevel = computed(() => {
    const arr = ids.value.map((id) => {
        return scheduleStore.level(store.currentName, id).level;
    });
    return arr
        .sort((a, b) => {
            return (
                arr.filter((v) => v === a).length -
                arr.filter((v) => v === b).length
            );
        })
        .pop();
});

const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return scheduleStore.level(store.currentName, ids.value[0]).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    scheduleStore.changeMultipleLevels(store.currentName, ids.value, level);
};

const levels = computed((): AvailabilityLevel[] => {
    return scheduleStore.scale.levels;
});

const selectedIntervalStrings = computed(() => {
    let intervals: Interval[] = [];
    for (const id of ids.value) {
        intervals.push(scheduleStore.intervals[id]);
    }
    return Interval.merge(intervals).map((interval) =>
        interval.toFormat('yyyy-MM-dd HH:mm')
    );
});
</script>

<style scoped>
.container {
    display: inline-block;
    height: 100%;
    overflow: hidden;
    width: 100%;
}
</style>
