<template>
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
import { NInput, NModal } from 'naive-ui';
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

let showJoinDialog = ref(false);
let joinName = ref();

let nameInput = ref<typeof NInput>();

const joinSchedule = () => {
    appStore.joinAs(joinName.value);
    scheduleStore.initialiseBlockData(joinName.value);
    joinName.value = '';
    showJoinDialog.value = false;
};

const show = () => {
    showJoinDialog.value = true;
};

defineExpose({ show });
</script>

<style scoped></style>
