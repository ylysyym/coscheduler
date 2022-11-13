<template>
    <div class="root">
        <div class="menu">
            <NavigationMenu />
        </div>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
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

.menu {
    height: 40px;
}
</style>
