<template>
    <h3 v-if="scheduleStore.people.length > 0">People</h3>
    <span v-else>There's no one here!</span>
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
                                @click="showPersonPopover[person] = true"
                                tertiary
                                :class="{
                                    struckout: !isChecked[person],
                                }"
                            >
                                {{ person }}
                            </n-button>
                        </template>
                        <n-space vertical>
                            <div class="person-header">
                                <strong>
                                    {{ person }}
                                </strong>
                                &nbsp;
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
import { computed, ref } from 'vue';
import { NButton, NCheckbox, NCheckboxGroup, NPopover, NSpace } from 'naive-ui';
import { isSmallScreen } from '@/utilities/breakpoints';
import { useUiStore } from '@/stores/ui';
import { useScheduleStore } from '@/stores/schedule';
import PersonStats from '@/components/PersonStats.vue';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const showPersonPopover = ref<{ [person: string]: boolean }>({});

type CheckedNameMap = { [name: string]: boolean };
const isChecked = computed(() => {
    return uiStore.selectedNames.reduce(
        (result: CheckedNameMap, name: string) => {
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
};
</script>

<style scoped>
.struckout {
    text-decoration: line-through;
}

.person-header {
    display: flex;
    justify-content: space-between;
}
</style>
