<template>
    <div class="container">
        <h1>Settings</h1>
        <n-space vertical>
            <n-form>
                <n-form-item label="Color palette">
                    <n-select
                        :options="colorOptions"
                        v-model:value="selectedMap"
                    />
                </n-form-item>
                <n-form-item label="Block display mode">
                    <n-radio-group v-model:value="orientation">
                        <n-radio
                            v-for="orientation in orientations"
                            :key="orientation.value"
                            :value="orientation.value"
                        >
                            {{ orientation.label }}
                        </n-radio>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="Date format">
                    <n-select
                        :options="dateFormatOptions"
                        v-model:value="dateFormat"
                    />
                </n-form-item>
                <n-form-item label="Time format">
                    <n-select
                        :options="timeFormatOptions"
                        v-model:value="timeFormat"
                    />
                </n-form-item>
                <n-form-item label="Preview">
                    <n-input :value="formatPreview" disabled />
                </n-form-item>
            </n-form>
            <n-button type="primary" @click="save">Save</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NRadio,
    NRadioGroup,
    NSelect,
    NSpace,
} from 'naive-ui';
import { DateTime } from 'luxon';
import { useSettingsStore } from '@/stores/settings';
import { defaultColorMaps } from '@/models/palettes/defaultColorMaps';
import { formatTime } from '@/utilities/formatTimes';

const store = useSettingsStore();

const colorMaps = defaultColorMaps;

const colorOptions = computed(() => {
    return colorMaps.map((map, index) => {
        return {
            label: map.name,
            value: index,
        };
    });
});

const selectedMap = ref(
    colorMaps.findIndex((palette) => {
        return JSON.stringify(palette.value) === JSON.stringify(store.colorMap);
    })
);

const orientations = [
    { label: 'Vertical stripes', value: 'bottom' },
    { label: 'Horizontal stripes', value: 'right' },
    { label: 'Diagonal stripes', value: 'bottom right' },
    { label: 'Pie', value: 'conic' },
];

const orientation = ref(store.orientation);

const now = DateTime.now();
const exampleDate = DateTime.now().set({
    hour: Math.min(now.hour, 13),
    day: Math.max(now.day, 13),
});

const dateFormats = [
    'yyyy LLL dd (EEE)',
    'yyyy-MM-dd (EEE)',
    'yyyy/MM/dd (EEE)',
    'EEEE, yyyy LLL dd',
    'EEE, yyyy LLL dd',
    'yyyy-MM-dd',
    'yyyy LLL dd',
    'EEE, dd MMM yyyy',
    'dd-MM-yyyy (EEE)',
    'EEE, MM/dd/yy',
    'EEEE, MMMM dd, yyyy',
];

const dateFormatOptions = computed(() => {
    return dateFormats.map((format) => {
        return {
            label: exampleDate.toFormat(format),
            value: format,
        };
    });
});

const timeFormats = ['HH:mm', 'hh:mm a', 'h:mm', 'h:mm a', 'HHmm'];

const timeFormatOptions = computed(() => {
    return timeFormats.map((format) => {
        return {
            label: exampleDate.toFormat(format),
            value: format,
        };
    });
});

const dateFormat = ref(store.dateFormat);
const timeFormat = ref(store.timeFormat);

const formatPreview = computed(() => {
    return formatTime(exampleDate, dateFormat.value, timeFormat.value);
});

const save = () => {
    store.setOrientation(orientation.value);
    store.setDateFormat(dateFormat.value);
    store.setTimeFormat(timeFormat.value);
    store.setColorMap(colorMaps[selectedMap.value].value);
};
</script>

<style scoped>
.container {
    margin: 0 auto;
    max-width: 900px;
}
</style>
