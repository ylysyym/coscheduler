<template>
    <n-popover
        trigger="manual"
        :show="isVisible"
        :x="position.x"
        :y="position.y"
        :animated="false"
        @clickoutside="hide"
        :to="parent"
        placement="right"
        v-if="data !== undefined"
    >
        <n-space vertical>
            <strong>{{ formatInterval(data?.interval) }}</strong>
            <n-space v-for="person in Object.keys(data?.entries)" :key="person">
                {{ person }}
                <n-tag
                    size="small"
                    :color="{
                        color: data?.entries[person].color,
                        textColor: readableColor(data?.entries[person].color),
                    }"
                >
                    {{ data?.entries[person].label }}
                </n-tag>
            </n-space>
        </n-space>
    </n-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { readableColor } from 'color2k';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { BlockData } from '@/models/BlockData';
import { formatInterval } from '@/utilities/formatTimes';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';

const appStore = useAppStore();
const scheduleStore = useScheduleStore();

const parent = ref<HTMLElement>();

const data = ref<BlockData | undefined>();

const isVisible = ref(false);

const position = ref({ x: 0, y: 0 });

const show = (
    id: number,
    newPosition: { x: number; y: number },
    el?: HTMLElement
) => {
    parent.value = el;
    data.value = scheduleStore.blockAtIndex(appStore.selectedNames, id);
    position.value = newPosition;
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

defineExpose({
    show,
});
</script>
