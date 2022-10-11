<template>
    <n-space size="large">
        <div class="logo">coscheduler</div>
        <router-link to="/">Schedule</router-link>
        <router-link to="/create">Create</router-link>
        <router-link to="/settings">Settings</router-link>
    </n-space>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui';
</script>

<style scoped>
.logo {
    background: #672bbb;
    color: #fff;
    display: inline-block;
    padding: 8px;
}
</style>
