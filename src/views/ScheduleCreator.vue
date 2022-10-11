<template>
    <div class="container">
        <h1>Create Schedule</h1>
        <n-form :rules="rules">
            <n-form-item label="Title" path="title">
                <n-input placeholder="Title" />
            </n-form-item>
            <n-form-item label="Description">
                <n-input type="textarea" placeholder="Description" />
            </n-form-item>
            <n-form-item label="Unit of time" path="timeUnit">
                <n-select
                    :options="schemas"
                    v-model:value="selectedSchema"
                    :on-update:value="onSchemaSelected"
                />
            </n-form-item>
            <n-form-item label="Time range" path="timeRange">
                <n-date-picker
                    :type="datePickerType"
                    v-model:value="timeRange"
                    :time-picker-props="timePickerProps"
                    update-value-on-close
                    :actions="null"
                    :format="dateFormat"
                />
            </n-form-item>
            <n-form-item label="Availability options">
                <n-select />
            </n-form-item>
            <n-button type="primary">Create</n-button>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    NButton,
    NDatePicker,
    NForm,
    NFormItem,
    NInput,
    NSelect,
} from 'naive-ui';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

let selectedSchema = ref(60);

const rules = {
    title: {
        required: true,
    },
    timeUnit: {
        required: true,
    },
    timeRange: {
        required: true,
    },
};

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
    max-width: 900px;
    margin: 0 auto;
}
</style>
