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
