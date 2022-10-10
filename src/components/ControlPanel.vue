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

const appStore = useAppStore();

let existingPeople = ref([] as string[]);
let people = computed(() => {
    if (!appStore.isJoining) {
        return existingPeople.value;
    }

    return [...existingPeople.value, appStore.currentName];
});
let showJoinDialog = ref(false);
let joinName = ref();

const joinSchedule = () => {
    appStore.startJoin(joinName.value);
    // TODO: set name
};

let isEditing = computed(() => appStore.isEditing);
</script>

<style scoped>
.container {
    padding: 5px;
}
</style>
