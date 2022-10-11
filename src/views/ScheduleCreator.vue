<template>
    <div class="container">
        <h1>Create Schedule</h1>
        <h4>Unit of time</h4>
        <n-select
            :options="schemas"
            v-model:value="selectedSchema"
            :on-update:value="onSchemaSelected"
        />
        <h4>Time range</h4>
        <n-date-picker
            :type="datePickerType"
            v-model:value="timeRange"
            :time-picker-props="timePickerProps"
            update-value-on-close
            :actions="null"
            :format="dateFormat"
        />
        <br />
        <n-button type="primary">Create</n-button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, NDatePicker, NSelect } from 'naive-ui';
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

let dateFormat = computed(() =>
    selectedSchema.value >= 24 * 60 ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'
);

const schemas = computed(() => {
    return Object.values(defaultTimeUnits)
        .filter((unit) => unit.blockUnit)
        .map((unit) => {
            return {
                label: unit.description,
                value: unit.minutes,
            };
        });
});

let timeRange = ref();

const onSchemaSelected = (value: number) => {
    if (selectedSchema.value === value) return;
    selectedSchema.value = value;
    timeRange.value = null;
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
}
</style>
