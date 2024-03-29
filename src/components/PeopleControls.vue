<template>
    <span v-if="scheduleStore.people.length <= 0">There's no one here!</span>
    <n-space :vertical="!isSmallScreen">
        <n-checkbox-group v-model:value="uiStore.selectedNames">
            <n-space :vertical="!isSmallScreen">
                <template v-for="person in scheduleStore.people" :key="person">
                    <n-popover
                        trigger="click"
                        :show="showPersonPopover[person]"
                        @clickoutside="showPersonPopover[person] = false"
                    >
                        <template #trigger>
                            <n-button
                                tertiary
                                :class="{
                                    'hidden-person': !isChecked[person],
                                }"
                                @click="showPersonPopover[person] = true"
                            >
                                {{ person }}
                            </n-button>
                        </template>
                        <n-space vertical>
                            <div class="person-header">
                                <strong>
                                    {{ person }}
                                </strong>
                                <n-checkbox
                                    :value="person"
                                    :disabled="uiStore.isEditing"
                                >
                                    Show
                                </n-checkbox>
                            </div>
                            <PersonStats :person="person" />
                            <n-button
                                :disabled="uiStore.isEditing"
                                type="primary"
                                @click="startEditing(person)"
                            >
                                Edit
                            </n-button>
                        </n-space>
                    </n-popover>
                </template>
            </n-space>
        </n-checkbox-group>
    </n-space>
</template>

<script setup lang="ts">
import { NButton, NCheckbox, NCheckboxGroup, NPopover, NSpace } from 'naive-ui';
import { computed, ref } from 'vue';
import PersonStats from '@/components/PersonStats.vue';
import { useScheduleStore } from '@/stores/schedule';
import { useUiStore } from '@/stores/ui';
import { isSmallScreen } from '@/utilities/breakpoints';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const showPersonPopover = ref<Record<string, boolean>>({});

const isChecked = computed(() => {
    return uiStore.selectedNames.reduce(
        (result: Record<string, boolean>, name: string) => {
            result[name] = true;
            return result;
        },
        {}
    );
});

const startEditing = (person: string) => {
    if (uiStore.isEditing) return;

    uiStore.isEditing = true;
    uiStore.isJoining = false;
    uiStore.userName = person;
    uiStore.currentEntry = scheduleStore.entries[person].slice();
    showPersonPopover.value[person] = false;
    uiStore.changeTab('edit');
};
</script>

<style scoped>
.hidden-person {
    text-decoration: line-through;
}

.person-header {
    display: flex;
    justify-content: space-between;
}
</style>
