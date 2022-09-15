<template>
    <div>
        <div class="block" @click="selectBlock"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { AvailabilityLevel } from '@/AvailabilityLevel';

const props = defineProps<{
    id: number;
    level: AvailabilityLevel;
    size: number;
}>();
const color = computed(() => props.level.color());
const size = ref(props.size + 'px');

const store = useAppStore();
const selectBlock = () => {
    store.selectItem(props.id);
};
</script>

<style scoped>
.block {
    background-color: v-bind(color);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
