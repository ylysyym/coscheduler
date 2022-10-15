<template>
    <n-modal
        v-model:show="showJoinDialog"
        preset="dialog"
        positive-text="Join"
        title="Join as"
        :show-icon="false"
        @positive-click="joinSchedule"
        :on-after-enter="nameInput?.focus()"
        @after-hide="hide"
    >
        <n-space vertical>
            <n-alert type="error" v-if="hasError">{{ alertMessage }}</n-alert>
            <n-input
                placeholder="Name"
                v-model:value="userName"
                ref="nameInput"
                @keyup.enter="joinSchedule"
            />
        </n-space>
    </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NAlert, NInput, NModal, NSpace } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

let showJoinDialog = ref(false);
let userName = ref('');
let alertMessage = ref('');
let hasError = ref(false);

let nameInput = ref<typeof NInput>();

const isBlankName = (name: string) => name.length === 0;

const isUniqueName = (name: string) => {
    return !scheduleStore.people.includes(name);
};

const validateName = (name: string) => {
    hasError.value = true;
    if (isBlankName(name)) {
        alertMessage.value = 'Name cannot be blank';
        return false;
    } else if (!isUniqueName(name)) {
        // TODO: either modify message to inform user of edit, or directly add edit button here
        alertMessage.value = `The name ${name} is already being used`;
        return false;
    }

    hasError.value = false;
    return true;
};

const joinSchedule = () => {
    if (!validateName(userName.value)) {
        return false;
    }

    appStore.joinAs(userName.value);
    scheduleStore.initialiseBlockData(userName.value);
    userName.value = '';
    hide();

    return true;
};

const show = () => {
    showJoinDialog.value = true;
};

const hide = () => {
    hasError.value = false;
    showJoinDialog.value = false;
};

defineExpose({ show });
</script>

<style scoped></style>
