<template>
    <div class="root">
        <NavigationMenu />
        <n-message-provider>
            <RouterView />
        </n-message-provider>
    </div>
</template>

<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
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
</style>
