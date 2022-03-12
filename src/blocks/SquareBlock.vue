<template>
    <div>
        <div class="block" :style="style" @click="selectBlock"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties } from "vue";
import { useAppStore } from "@/stores/app";
import { AvailabilityLevel } from "@/AvailabilityLevel";

const props = defineProps<{
    id: number;
    level: AvailabilityLevel;
    size: number;
}>();
const color = ref("red");
const style = computed((): CSSProperties => {
    return {
        // @ts-ignore https://github.com/johnsoncodehk/vue-tsc/issues/19
        "--color": props.level.color(),
        "--size": props.size + "px",
    };
});

const store = useAppStore();
const selectBlock = () => {
    store.selectItem(props.id);
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
