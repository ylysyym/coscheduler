<template>
    <div>
        <div
            class="color-block"
            v-for="(color, index) in colors"
            :key="index"
            :style="{
                background: color,
            }"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { colorScale } from '@/utilities/colorScale';

const props = defineProps<{
    palette: string | string[];
}>();

const sectionCount = 20;

const colors = computed(() => {
    const scale = colorScale(props.palette);

    const result = [];
    for (let i = 0; i < sectionCount; i++) {
        result.push(scale(i / (sectionCount - 1)));
    }

    return result;
});
</script>

<style scoped>
.color-block {
    display: inline-block;
    height: 24px;
    margin: 4px 0;
    user-select: none;
    width: 5%;
}
</style>
