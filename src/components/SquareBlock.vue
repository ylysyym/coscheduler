<template>
    <div v-if="!store.isEditing">
        <n-popover trigger="click">
            <template #trigger>
                <div class="block" @click="selectBlock"></div>
            </template>
            <n-space vertical>
                <strong>{{ formatInterval(data.interval) }}</strong>

                <n-space
                    v-for="person in Object.keys(data.entries)"
                    :key="person"
                >
                    {{ person }}
                    <n-tag
                        size="small"
                        :color="{
                            color: data.entries[person].color,
                            textColor: readableColor(
                                data.entries[person].color
                            ),
                        }"
                        >{{ data.entries[person].label }}</n-tag
                    >
                </n-space>
            </n-space>
        </n-popover>
    </div>
    <div v-else>
        <div class="block" @click="selectBlock"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { readableColor } from 'color2k';
import { Interval } from 'luxon';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { BlockData } from '@/models/BlockData';
import { defaultAvailabilityScale } from '@/models/availability/defaultAvailabilityScale';

const props = defineProps<{
    id: number;
    data: BlockData;
    size: number;
}>();

const formatInterval = (interval: Interval) => {
    return interval.toFormat('yyyy-MM-dd HH:mm');
};

const background = computed(() => {
    if (Object.keys(props.data.entries).length === 0) {
        // TODO: better way of referencing default color
        return defaultAvailabilityScale.levels[0].color;
    }

    let result = 'linear-gradient(to bottom right';
    let n = 100 / Object.keys(props.data.entries).length;
    let sorted = Object.values(props.data.entries);
    sorted.sort((a, b) => b.level - a.level);
    for (let i = 0; i < sorted.length; i++) {
        result += `, ${sorted[i].color} ${i * n}%, ${sorted[i].color} ${
            (i + 1) * n
        }%`;
    }
    result += ')';
    return result;
});
const size = computed(() => props.size + 'px');

const store = useAppStore();

const selectBlock = () => {
    store.selectItem(props.id);
};
</script>

<style scoped>
.block {
    background: v-bind(background);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
