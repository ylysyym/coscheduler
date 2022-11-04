<template>
    <div v-if="!store.isEditing">
        <n-popover trigger="click">
            <template #trigger>
                <div class="block"></div>
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
                    >
                        {{ data.entries[person].label }}
                    </n-tag>
                </n-space>
            </n-space>
        </n-popover>
    </div>
    <div v-else>
        <div class="block"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { readableColor } from 'color2k';
import { NPopover, NSpace, NTag } from 'naive-ui';
import { useAppStore } from '@/stores/app';
import { useScheduleStore } from '@/stores/schedule';
import { useSettingsStore } from '@/stores/settings';
import { BlockData } from '@/models/BlockData';
import { formatInterval } from '@/utilities/formatTimes';

const props = defineProps<{
    data: BlockData;
    size: number;
}>();

const store = useAppStore();
const settingsStore = useSettingsStore();
const scheduleStore = useScheduleStore();

const background = computed(() => {
    if (Object.keys(props.data.entries).length === 0) {
        return scheduleStore.scale.levels[0].color;
    }

    let result = 'linear-gradient(to ' + settingsStore.orientation;
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
</script>

<style scoped>
.block {
    background: v-bind(background);
    display: inline-block;
    height: v-bind(size);
    width: v-bind(size);
}
</style>
