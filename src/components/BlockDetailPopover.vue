<template>
    <n-popover
        trigger="manual"
        style="padding: 0"
        :show="isVisible"
        :x="position.x"
        :y="position.y"
        :animated="false"
        :placement="placement"
        :show-arrow="false"
        v-if="data !== undefined"
    >
        <div class="header">{{ formatInterval(data.interval) }}</div>
        <div class="content" v-if="!uiStore.isEditing && people.length">
            <n-space vertical>
                <n-space v-for="person in people" :key="person">
                    {{ person }}
                    <n-tag
                        size="small"
                        :color="{
                            color: data.entries[person].color,
                            textColor: readableColor(
                                data.entries[person].color
                            ),
                        }"
                    >
                        {{ data.entries[person].label }}
                    </n-tag>
                </n-space>
            </n-space>
        </div>
    </n-popover>
</template>

<script setup lang="ts">
import { readableColor } from 'color2k';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { computed, ref } from 'vue';
import { BlockData } from '@/models/BlockData';
import { useScheduleStore } from '@/stores/schedule';
import { useUiStore } from '@/stores/ui';
import { formatInterval } from '@/utilities/formatTime';

const uiStore = useUiStore();
const scheduleStore = useScheduleStore();

const data = ref<BlockData>();

const people = computed(() => Object.keys(data.value?.entries || {}));

const isVisible = ref(false);

const position = ref({ x: 0, y: 0 });

const placement = ref<'left' | 'right'>('right');

const show = (
    id: number,
    newPosition: { x: number; y: number },
    isLeftHalf: boolean
) => {
    placement.value = isLeftHalf ? 'right' : 'left';
    data.value = scheduleStore.blockAtIndex(uiStore.selectedNames, id);
    position.value = newPosition;
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

defineExpose({
    show,
    hide,
});
</script>

<style scoped>
.header {
    background: #672bbb;
    color: white;
    font-weight: bold;
    padding: 8px;
    text-align: center;
}

.content {
    padding: 8px;
}
</style>
