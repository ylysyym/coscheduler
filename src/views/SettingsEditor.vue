<template>
    <div class="container">
        <h1>Settings</h1>
        <n-space vertical>
            <div>
                <h4>Multi-display orientation</h4>
                <n-radio-group v-model:value="orientation">
                    <n-radio
                        v-for="orientation in orientations"
                        :key="orientation.value"
                        :value="orientation.value"
                    >
                        {{ orientation.label }}
                    </n-radio>
                </n-radio-group>
            </div>
            <n-button type="primary">Save</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';

const store = useSettingsStore();

const orientations = [
    { label: 'Vertical', value: 'bottom' },
    { label: 'Horizontal', value: 'right' },
    { label: 'Diagonal', value: 'bottom right' },
];

let orientation = computed({
    get: () => store.orientation,
    set: (value) => store.setOrientation(value),
});
</script>

<style scoped>
.container {
    margin: 0 auto;
    max-width: 900px;
}
</style>
