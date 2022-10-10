<template>
    <h1>Create Schedule</h1>
    <h4>Unit of time</h4>
    <n-select
        :options="schemas"
        v-model:value="selectedSchema"
        :on-update:value="resetPicker"
    />
    <h4>Time range</h4>
    <n-date-picker
        :type="datePickerType"
        v-model:value="timeRange"
        :time-picker-props="timePickerProps"
        update-value-on-close
        :actions="null"
        :format="pickerFormat"
    />
</template>

<script setup lang="ts">
import { NSelect, NDatePicker } from 'naive-ui';
import { computed, ref } from 'vue';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

let selectedSchema = ref(60);

let timePickerProps = computed(() => {
    let minutes = [];
    for (let i = 0; i < 60; i += selectedSchema.value) {
        minutes.push(i);
    }
    return {
        format: 'HH:mm',
        minutes,
    };
});

let datePickerType = computed(() =>
    selectedSchema.value >= 24 * 60 ? 'daterange' : 'datetimerange'
);

let pickerFormat = computed(() =>
    selectedSchema.value >= 24 * 60 ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'
);

const schemas = computed(() => {
    return defaultTimeUnits.map((unit) => {
        return {
            label: unit.longDesc,
            value: unit.minutes,
        };
    });
});

let timeRange = ref();

const resetPicker = () => (timeRange.value = null);
</script>
