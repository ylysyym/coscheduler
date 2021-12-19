<template>
    <div class="block" :style="style" @click="toggleBlock"></div>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties } from "vue";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
    id: number;
    value?: number;
    scale?: number;
    size: number;
}>();
const color = ref("red");
const style = computed((): CSSProperties => {
    return {
        // @ts-ignore https://github.com/johnsoncodehk/vue-tsc/issues/19
        "--color": color.value,
        "--size": props.size + "px",
    };
});

const store = useAppStore();
const toggleBlock = () => {
    store.toggleItem(props.id);
};
</script>

<style scoped>
.block {
    background-color: var(--color);
    display: inline-block;
    height: var(--size);
    width: var(--size);
}
</style>
