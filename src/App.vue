<template>
    <div class="root">
        <div class="menu">
            <NavigationMenu />
        </div>
        <ScheduleView />
    </div>
</template>

<script setup lang="ts">
import NavigationMenu from '@/NavigationMenu.vue';
import ScheduleView from './ScheduleView.vue';
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
