<template>
    <div class="container">
        <h3 v-if="people.length > 0">People</h3>
        <span v-else>There's no one here!</span>
        <n-space :vertical="!isSmallScreen">
            <n-button v-for="person in people" :key="person">{{
                person
            }}</n-button>
            <n-button
                type="primary"
                @click="showJoinDialog = true"
                v-if="!isEditing"
            >
                Join
            </n-button>
            <n-button type="primary" @click="stopEditing()" v-else
                >Save</n-button
            >
        </n-space>
    </div>
    <n-modal
        v-model:show="showJoinDialog"
        preset="dialog"
        positive-text="Join"
        title="Join as"
        :show-icon="false"
        @positive-click="joinSchedule"
        :on-after-enter="nameInput?.focus()"
    >
        <n-input
            placeholder="Name"
            v-model:value="joinName"
            ref="nameInput"
            @keyup.enter="joinSchedule"
        />
    </n-modal>
</template>

<script setup lang="ts">
import { NButton, NSpace, NInput, NModal } from 'naive-ui';
import { computed, ref } from 'vue';
import { isSmallScreen } from '@/utilities/breakpoints';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

let people = computed(() => scheduleStore.people);
let showJoinDialog = ref(false);
let joinName = ref();

let nameInput = ref<typeof NInput>();

const joinSchedule = () => {
    appStore.joinAs(joinName.value);
    scheduleStore.initialiseBlockData(joinName.value);
    joinName.value = '';
    showJoinDialog.value = false;
};

const stopEditing = () => {
    // TODO: save changes remotely at this point
    appStore.stopEditing();
};

let isEditing = computed(() => appStore.isEditing);
</script>

<style scoped>
.container {
    padding: 5px;
}
</style>