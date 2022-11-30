<template>
    Minimum availability
    <n-select
        :options="availabilityOptions"
        v-model:value="selectedAvailability"
        @update:value="updateFilterAvailability"
    />
    Minimum duration
    <n-slider
        :min="1"
        :max="Math.min(scheduleStore.blockCount, 40)"
        :format-tooltip="formatDuration"
        v-model:value="minimumDuration"
        @update:value="updateFilterDuration"
    />
    Minimum number of people
    <n-slider
        :min="1"
        :max="peopleCount"
        :marks="peopleMarks"
        :tooltip="false"
        v-model:value="minimumPeople"
        @update:value="updateFilterPeopleCount"
    />
    <strong>Matches</strong>
    <n-ellipsis :line-clamp="5" style="width: 100%">
        <div v-for="(interval, index) in filteredIntervals" :key="index">
            {{ interval }}
        </div>
        <div v-if="filteredIntervals.length === 0">
            Nothing matches your conditions
        </div>
    </n-ellipsis>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NEllipsis, NSelect, NSlider } from 'naive-ui';
import { Duration, Interval } from 'luxon';
import { useScheduleStore } from '@/stores/schedule';
import { useFilterStore } from '@/stores/filter';
import { formatInterval } from '@/utilities/formatTime';

const scheduleStore = useScheduleStore();
const filterStore = useFilterStore();

const availabilityOptions = computed(() => {
    return scheduleStore.levels.map((level) => {
        return {
            value: level.level,
            label: level.label,
        };
    });
});

const selectedAvailability = ref(filterStore.minimumAvailability);

const formatDuration = (n: number) => {
    return Duration.fromObject({
        minutes: scheduleStore.blockDuration * n,
    })
        .rescale()
        .toHuman();
};

const peopleCount = computed(() => scheduleStore.people.length);

const peopleMarks = computed(() => {
    const marks = {} as { [n: number]: string };
    marks[peopleCount.value] = 'All';
    for (let i = 1; i < peopleCount.value; i++) {
        marks[i] = i.toString();
    }

    return marks;
});

const minimumPeople = ref(filterStore.minimumPeople);
const minimumDuration = ref(filterStore.minimumDuration);

const updateFilterAvailability = (availability: number) => {
    filterStore.minimumAvailability = availability;
};

const updateFilterDuration = (duration: number) => {
    filterStore.minimumDuration = duration;
};

const updateFilterPeopleCount = (people: number) => {
    filterStore.minimumPeople = people;
};

const filteredIntervals = computed(() => {
    return filterStore.longestBlockRanges.map((range) => {
        const interval = Interval.fromDateTimes(
            scheduleStore.intervals[range[0]].start,
            scheduleStore.intervals[range[1]].end
        );
        return formatInterval(interval);
    });
});
</script>
