<template>
    <div class="container">
        <h3 v-if="people.length > 0">People</h3>
        <span v-else>There's no one here!</span>
        <n-space :vertical="!isSmallScreen">
            <n-button v-for="person in people" :key="person">{{
                person
            }}</n-button>
            <n-button type="primary">Join</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { ref } from 'vue';
import { isSmallScreen } from '@/utilities/breakpoints';

let people = ref([]);
</script>

<style scoped>
.container {
    padding: 5px;
}
</style>
