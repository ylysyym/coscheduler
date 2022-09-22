<template>
    <h1>Create Schedule</h1>
    <h4>Unit of time</h4>
    <n-select :options="schemas" />
    <h4>Time range</h4>
    <n-date-picker
        type="datetimerange"
        v-model:value="timeRange"
        :time-picker-props="{ format: 'HH:mm' }"
    />
</template>

<script setup lang="ts">
import { NSelect, NDatePicker } from 'naive-ui';
import { computed, ref } from 'vue';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

const schemas = computed(() => {
    return defaultTimeUnits.map((unit) => {
        return {
            label: unit.longDesc,
            value: unit.minutes,
        };
    });
});

let timeRange = ref();
</script>
