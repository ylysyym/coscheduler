<template>
    <div class="root">
        <NavigationMenu />
        <div class="app-container">
            <n-message-provider>
                <n-dialog-provider>
                    <RouterView />
                </n-dialog-provider>
            </n-message-provider>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NDialogProvider, NMessageProvider } from 'naive-ui';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { useSettingsStore } from '@/stores/settings';

const store = useSettingsStore();
store.initialise();
</script>

<style scoped>
.root {
    height: 100vh;
    overflow: hidden;
}

.app-container {
    height: calc(100% - 40px);
}
</style>
