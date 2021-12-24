<template>
    <div class="container">
        <div class="row" v-for="row in rows" :key="row">
            <SquareBlock
                class="block"
                v-for="column in columns"
                :id="(row - 1) * columns + column - 1"
                :key="column"
                :size="blockSize"
                :style="style"
                :level="levels((row - 1) * columns + column - 1)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime, Duration } from "luxon";
import SquareBlock from "@/blocks/SquareBlock.vue";
import { useGridStateStore } from "@/stores/gridState";
import { AvailabilityLevel } from "@/AvailabilityLevel";

const rows = ref(7);
const columns = ref(24);
const blockSize = ref(30);
const gap = ref(5);
const currentDate = ref(DateTime.now());
const startDate = (): DateTime => {
    return currentDate.value;
};
const blockCount = computed(() => rows.value * columns.value);
const store = useGridStateStore();
const levels = (index: number): AvailabilityLevel => store.level(index);
const defaultDuration: Duration = Duration.fromObject({
    hours: 1,
});

const duration = computed(() => defaultDuration);

store.initialiseBlockData(blockCount.value, startDate(), duration.value);

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
