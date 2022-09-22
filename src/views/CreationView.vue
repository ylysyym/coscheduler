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
import { ref } from 'vue';

const schemas = ref([
    { label: '5 minutes', value: 0 },
    { label: '10 minutes', value: 1 },
    { label: '15 minutes', value: 2 },
    { label: '30 minutes', value: 3 },
    { label: '1 hour', value: 4 },
    { label: '1 day', value: 5 },
]);

let timeRange = ref();
</script>
