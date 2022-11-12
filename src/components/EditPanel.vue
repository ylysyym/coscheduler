<template>
    <div>
        <n-space vertical>
            <div>
                <n-form :rules="rules" :model="fields" ref="form">
                    <n-form-item label="Name" path="name">
                        <n-input
                            placeholder="Name"
                            v-model:value="fields.name"
                            :disabled="!uiStore.isJoining"
                            autofocus
                        />
                    </n-form-item>
                </n-form>
            </div>
            <div v-if="uiStore.hasSelectedItem">
                <div>
                    <strong>Selection</strong>
                    <n-ellipsis :line-clamp="3" style="width: 100%">
                        <div v-for="x in formattedSelectedIntervals" :key="x">
                            {{ x }}
                        </div>
                    </n-ellipsis>
                </div>
                <div>
                    <strong>Status</strong>
                    <n-space :vertical="!isSmallScreen" size="small">
                        <n-button
                            v-for="level in visibleLevels"
                            :key="level.level"
                            :value="level.level"
                            @click="changeLevel(level.level)"
                            :tertiary="level.level === selectedLevel"
                            :strong="level.level === selectedLevel"
                        >
                            <span :style="{ color: level.color }">●</span>
                            {{ level.label }}
                        </n-button>
                    </n-space>
                </div>
            </div>
            <div v-else>
                <div>Click a square to select it.</div>
                <div>Drag to select multiple squares.</div>
            </div>
            <n-button type="primary" @click="saveChanges">Save</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Interval } from 'luxon';
import { NButton, NEllipsis, NForm, NFormItem, NInput, NSpace } from 'naive-ui';
import type { FormRules } from 'naive-ui';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { isSmallScreen } from '@/utilities/breakpoints';
import { formatInterval } from '@/utilities/formatTimes';
import { updateSchedule } from '@/api/schedules';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const mostSelectedLevel = computed(() => {
    const selectedLevels = Array.from(uiStore.selectedItems).map(
        (id) => uiStore.level(id).level
    );
    return selectedLevels
        .sort((a, b) => {
            return (
                selectedLevels.filter((v) => v === a).length -
                selectedLevels.filter((v) => v === b).length
            );
        })
        .pop();
});

const hasSingleSelectedItem = computed(() => uiStore.selectedItems.size === 1);

const selectedLevel = computed(() => {
    if (hasSingleSelectedItem.value) {
        return uiStore.level(uiStore.firstSelectedItem).level;
    } else {
        return mostSelectedLevel.value;
    }
});

const changeLevel = (level: number) => {
    uiStore.changeSelectedLevels(level);
};

const visibleLevels = computed((): AvailabilityLevel[] => {
    return scheduleStore.scale.levels.filter((level) => level.hidden !== true);
});

const selectedIntervals = computed(() => {
    return Array.from(uiStore.selectedItems).map(
        (id) => scheduleStore.intervals[id]
    );
});

const formattedSelectedIntervals = computed(() => {
    return Interval.merge(selectedIntervals.value).map((interval) =>
        formatInterval(interval)
    );
});

const rules = ref<FormRules>({
    name: {
        required: true,
        message: 'Please enter a name',
        validator: (rule, value) => {
            if (value.length <= 0) {
                return false;
            } else if (uiStore.isJoining && value in scheduleStore.entries) {
                rule.message = 'Name is already in use';
                return false;
            }

            return true;
        },
    },
});

const form = ref<InstanceType<typeof NForm>>();

const fields = ref({
    name: uiStore.userName,
});

const saveChanges = () => {
    form.value?.validate().then(() => {
        scheduleStore.entries[fields.value.name] = uiStore.currentEntry.slice();
        updateSchedule(scheduleStore.id, {
            [fields.value.name]: uiStore.currentEntry,
        });

        if (uiStore.isJoining) {
            uiStore.selectedNames.push(fields.value.name);
        }

        uiStore.stopEditing();
    });
};
</script>
