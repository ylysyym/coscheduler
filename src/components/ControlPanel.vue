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
    >
        <n-input placeholder="Name" v-model:value="joinName" />
    </n-modal>
</template>

<script setup lang="ts">
import { NButton, NSpace, NInput, NModal } from 'naive-ui';
import { computed, ref } from 'vue';
import { isSmallScreen } from '@/utilities/breakpoints';
import { useAppStore } from '@/stores/app';
import { useGridStateStore } from '@/stores/gridState';

const appStore = useAppStore();
const gridStateStore = useGridStateStore();

let existingPeople = computed(() => gridStateStore.people);
let people = computed(() => {
    if (!appStore.isJoining) {
        return existingPeople.value;
    }

    return [...existingPeople.value, appStore.currentName];
});
let showJoinDialog = ref(false);
let joinName = ref();

const joinSchedule = () => {
    appStore.joinAs(joinName.value);
    joinName.value = '';
    gridStateStore.initialiseBlockData();
};

const stopEditing = () => {
    gridStateStore.saveNew(appStore.currentName);
    appStore.stopEditing();
};

let isEditing = computed(() => appStore.isEditing);
</script>

<style scoped>
.container {
    padding: 5px;
}
</style>
