<template>
    <div class="container">
        <h3 v-if="people.length > 0">People</h3>
        <span v-else>There's no one here!</span>
        <n-space :vertical="!isSmallScreen">
            <n-checkbox-group v-model:value="appStore.selectedNames">
                <n-space :vertical="!isSmallScreen">
                    <template v-for="person in people" :key="person">
                        <n-popover
                            trigger="click"
                            :show="showPersonPopover[person]"
                            @clickoutside="showPersonPopover[person] = false"
                        >
                            <template #trigger>
                                <n-button
                                    @click="showPersonPopover[person] = true"
                                    tertiary
                                    :class="{ struckout: !isChecked[person] }"
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
                                        :disabled="appStore.isEditing"
                                    >
                                        Show
                                    </n-checkbox>
                                </div>
                                <PersonStats :person="person" />
                                <n-button
                                    :disabled="appStore.isEditing"
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
            <n-button
                type="primary"
                @click="$emit('showJoinDialog')"
                v-if="!appStore.isEditing"
            >
                Join
            </n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { NButton, NCheckbox, NCheckboxGroup, NPopover, NSpace } from 'naive-ui';
import { computed, ref } from 'vue';
import { isSmallScreen } from '@/utilities/breakpoints';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import PersonStats from '@/components/PersonStats.vue';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

let people = computed(() => scheduleStore.people);
let showPersonPopover = ref<{ [person: string]: boolean }>({});

const startEditing = (person: string) => {
    if (appStore.isEditing) return;
    appStore.isEditing = true;
    appStore.isJoining = false;
    appStore.userName = person;
    appStore.selectedNames = [person];
    showPersonPopover.value[person] = false;
};

type CheckedNameMap = { [name: string]: boolean };
let isChecked = computed(() => {
    return appStore.selectedNames.reduce(
        (result: CheckedNameMap, name: string) => {
            result[name] = true;
            return result;
        },
        {}
    );
});

defineEmits(['showJoinDialog']);
</script>

<style scoped>
.container {
    padding: 5px;
}

.struckout {
    text-decoration: line-through;
}

.person-header {
    display: flex;
    justify-content: space-between;
}
</style>
