<template>
    <div class="container">
        <div class="row" v-for="row in rows" :key="row">
            <SquareBlock
                class="block"
                v-for="column in columns"
                :id="(row - 1) * columns + column"
                :key="column"
                :size="blockSize"
                :style="style"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SquareBlock from "@/blocks/SquareBlock.vue";

const rows = ref(7);
const columns = ref(24);
const blockSize = ref(30);
const gap = ref(5);

const style = computed(() => {
    return {
        "--blockGap": gap.value / 2 + "px",
    };
});
</script>

<style scoped>
.row {
    line-height: 0;
}

.block {
    margin: var(--blockGap);
}
</style>
