<template>
    <div class="container">
        <div class="content-wrapper">
            <n-icon size="70">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 20 20"
                >
                    <g fill="none">
                        <path
                            d="M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16zm0 1a7 7 0 1 0 0 14a7 7 0 0 0 0-14zm0 9.5a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5zM10 6a.5.5 0 0 1 .492.41l.008.09V11a.5.5 0 0 1-.992.09L9.5 11V6.5A.5.5 0 0 1 10 6z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
            </n-icon>
            <div class="error-notification">
                There was an issue viewing the schedule
            </div>
            <div class="error-message">{{ error }}</div>
            <div class="error-suggestion">
                Instead, you can try:
                <n-button type="primary" @click="$router.push('/create')">
                    Create new schedule
                </n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';

defineProps<{
    error: string;
}>();
</script>

<style scoped>
.container {
    align-items: center;
    display: flex !important;
    justify-content: center;
}

.content-wrapper {
    display: block;
    text-align: center;
}

.error-notification {
    font-size: 2em;
    font-weight: bold;
}

.error-message {
    font-size: 1.5em;
}

.error-suggestion {
    margin-top: 30px;
}
</style>
