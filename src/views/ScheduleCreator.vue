<template>
    <div class="container">
        <n-scrollbar>
            <div class="inner-container">
                <h1>Create Schedule</h1>
                <n-form ref="form" :rules="rules" :model="fields">
                    <n-form-item label="Title" path="title">
                        <n-input
                            v-model:value="fields.title"
                            placeholder="Title"
                        />
                    </n-form-item>
                    <n-form-item label="Unit of time" path="timeUnit">
                        <n-select
                            v-model:value="fields.timeUnit"
                            :options="schemas"
                            :on-update:value="onSchemaSelected"
                        />
                    </n-form-item>
                    <n-form-item label="Time range" path="timeRange">
                        <n-date-picker
                            v-model:value="fields.timeRange"
                            panel
                            type="datetimerange"
                            :time-picker-props="timePickerProps"
                            update-value-on-close
                            :actions="null"
                            :format="dateFormat"
                        />
                    </n-form-item>
                    <n-form-item label="Availability options" path="scale">
                        <n-select
                            v-model:value="fields.scale"
                            :options="levelOptions"
                        />
                    </n-form-item>
                    <n-button type="primary" @click="create">Create</n-button>
                </n-form>
            </div>
        </n-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import {
    NButton,
    NDatePicker,
    NForm,
    NFormItem,
    NInput,
    NScrollbar,
    NSelect,
    useMessage,
} from 'naive-ui';
import type { FormRules } from 'naive-ui';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createSchedule } from '@/api/schedules';
import { ScheduleParameters } from '@/models/ScheduleParameters';
import { defaultLevelLabels } from '@/models/defaultLevels';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

const router = useRouter();
const message = useMessage();

const form = ref<InstanceType<typeof NForm>>();

const fields = reactive({
    title: '',
    timeUnit: 60,
    timeRange: null as [number, number] | null,
    scale: 0,
});

const maxTitleLength = ref(240);

const rules: FormRules = {
    title: {
        required: true,
        validator: (rule, value) => {
            if (value.length <= 0) {
                return false;
            } else if (value.length > maxTitleLength.value) {
                rule.message = `Title can have a maximum of ${maxTitleLength.value} characters (currently ${value.length})`;
                return false;
            }

            return true;
        },
        message: 'Please enter a title for the schedule',
    },
    timeUnit: {
        required: true,
    },
    timeRange: {
        required: true,
        validator: (rule, value) => {
            if (value === null) {
                return false;
            } else if (value[1] - value[0] <= 0) {
                rule.message = 'Please select a longer time range';
                return false;
            }
            return true;
        },
        message: 'Please select a valid time range for the schedule',
    },
    scale: {
        required: true,
    },
};

const timePickerProps = computed(() => {
    const minutes = [];
    for (let i = 0; i < 60; i += fields.timeUnit) {
        minutes.push(i);
    }
    return {
        format: 'HH:mm',
        minutes,
    };
});

const dateFormat = 'yyyy-MM-dd HH:mm';

const schemas = computed(() => {
    return Object.values(defaultTimeUnits).map((unit) => {
        return {
            label: unit.description,
            value: unit.minutes,
        };
    });
});

const blockCount = computed(() => {
    if (!fields.timeRange) return 0;
    return Math.ceil(
        (fields.timeRange[1] - fields.timeRange[0]) /
            (fields.timeUnit * 1000 * 60)
    );
});

const levels = defaultLevelLabels;

const levelOptions = computed(() => {
    return levels.map((level, index) => {
        return {
            label: level.join(' - '),
            value: index,
        };
    });
});

const onSchemaSelected = (value: number) => {
    if (fields.timeUnit === value) return;
    fields.timeUnit = value;
    fields.timeRange = null;
};

const create = () => {
    form.value
        ?.validate()
        .then(() => {
            if (fields.timeRange === null) return;

            const params: ScheduleParameters = {
                title: fields.title,
                blockCount: blockCount.value,
                blockDuration: fields.timeUnit,
                startTime: DateTime.fromMillis(fields.timeRange[0]),
                levels: levels[fields.scale],
            };

            return createSchedule(params)
                .then((id: string) => {
                    router.push('/schedule/' + id);
                })
                .catch(() => {
                    message.error(
                        'An error occured while creating your schedule'
                    );
                });
        })
        .catch(() => {
            // validation failed, do nothing
        });
};
</script>

<style scoped>
.container {
    height: 100%;
}
.inner-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 12px;
}
</style>
