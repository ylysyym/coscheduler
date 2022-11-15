<template>
    <div class="schedule-title">{{ scheduleStore.title }}</div>
</template>

<script setup lang="ts">
import { useScheduleStore } from '@/stores/schedule';

const scheduleStore = useScheduleStore();
</script>

<style scoped>
.schedule-title {
    font-size: 20px;
    font-weight: bold;
    height: 30px;
    padding: 8px;
}
</style>
