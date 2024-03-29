<template>
    <n-space vertical>
        <div v-if="uiStore.hasSelectedItem">
            <div>
                <strong>Selection</strong>
                <n-ellipsis :line-clamp="3" style="width: 100%">
                    <div
                        v-for="(interval, index) in formattedSelectedIntervals"
                        :key="index"
                    >
                        {{ interval }}
                    </div>
                </n-ellipsis>
            </div>
            <div>
                <strong>Status</strong>
                <n-space :vertical="!isSmallScreen" size="small">
                    <n-button
                        v-for="level in scheduleStore.levels"
                        :key="level.level"
                        :value="level.level"
                        :color="
                            level.level === selectedLevel
                                ? level.color
                                : undefined
                        "
                        :text-color="
                            level.level === selectedLevel
                                ? toRgba(readableColor(level.color))
                                : undefined
                        "
                        :style="
                            level.level === selectedLevel
                                ? undefined
                                : `box-shadow: inset 6px 0 0 0 ${level.color}`
                        "
                        :secondary="level.level !== selectedLevel"
                        @click="changeLevel(level.level)"
                    >
                        {{ level.label }}
                    </n-button>
                </n-space>
            </div>
        </div>
        <div v-else>
            <div>Click a square to select it.</div>
            <div>Drag to select multiple squares.</div>
        </div>
        <div>
            <n-input-group>
                <n-input
                    v-model:value="name"
                    placeholder="Name"
                    :disabled="!uiStore.isJoining"
                    :status="isValidName ? undefined : 'error'"
                    autofocus
                />
                <n-button type="primary" @click="saveChanges">Save</n-button>
            </n-input-group>
            <span :class="{ errorLabel: !isValidName }">{{
                nameValidationMessage
            }}</span>
        </div>
    </n-space>
</template>

<script setup lang="ts">
import { readableColor, toRgba } from 'color2k';
import { Interval } from 'luxon';
import {
    NButton,
    NEllipsis,
    NInput,
    NInputGroup,
    NSpace,
    useMessage,
} from 'naive-ui';
import { computed, ref } from 'vue';
import { updateSchedule } from '@/api/schedules';
import { useScheduleStore } from '@/stores/schedule';
import { useUiStore } from '@/stores/ui';
import { isSmallScreen } from '@/utilities/breakpoints';
import { formatInterval } from '@/utilities/formatTime';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const message = useMessage();

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

const name = ref(uiStore.userName);
const isValidName = ref(true);
const nameValidationMessage = ref('');

const isExistingName = computed(() => name.value in scheduleStore.entries);

const validateName = () => {
    if (name.value.length === 0) {
        nameValidationMessage.value = 'Name is required';
        return false;
    } else if (isExistingName.value) {
        nameValidationMessage.value = 'Name is already being used';
        return false;
    }

    return true;
};

const saveChanges = () => {
    if (uiStore.isJoining) {
        isValidName.value = validateName();

        if (!isValidName.value) return;
    }

    scheduleStore.updateEntry(name.value, uiStore.currentEntry.slice());
    updateSchedule(uiStore.scheduleId, {
        [name.value]: uiStore.currentEntry,
    })
        .then(() => {
            if (uiStore.isJoining) {
                uiStore.selectedNames.push(name.value);
            }

            uiStore.stopEditing();
        })
        .catch(() => {
            message.error('An error occured while saving your changes');
        });
};
</script>

<style scoped>
.errorLabel {
    color: red;
}
</style>
