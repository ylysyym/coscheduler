<template>
    <div v-if="hasSelectedItem">{{ id }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "./stores/app";

const store = useAppStore();
const id = computed(() => store.selectedItem);
const hasSelectedItem = computed(() => store.hasSelectedItem);
</script>

<style scoped></style>
