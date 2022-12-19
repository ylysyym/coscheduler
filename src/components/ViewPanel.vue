<template>
    <n-collapse
        arrow-placement="right"
        :default-expanded-names="uiStore.expandedSections"
        @item-header-click="toggleSection"
    >
        <template #arrow>&nbsp;</template>
        <template #header-extra="props">
            <n-icon size="20" v-if="props.collapsed">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 48 48"
                >
                    <g fill="none">
                        <path
                            d="M8.44 15.94a1.5 1.5 0 0 1 2.12 0L24 29.378l13.44-13.44a1.5 1.5 0 0 1 2.12 2.122l-14.5 14.5a1.5 1.5 0 0 1-2.12 0l-14.5-14.5a1.5 1.5 0 0 1 0-2.122z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
            </n-icon>
            <n-icon size="20" v-else>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 48 48"
                >
                    <g fill="none">
                        <path
                            d="M39.56 32.06a1.5 1.5 0 0 1-2.12 0L24 18.622l-13.44 13.44a1.5 1.5 0 0 1-2.12-2.122l14.5-14.5a1.5 1.5 0 0 1 2.12 0l14.5 14.5a1.5 1.5 0 0 1 0 2.122z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
            </n-icon>
        </template>
        <n-collapse-item name="people">
            <template #header>
                <strong>People</strong>
            </template>
            <PeopleControls />
        </n-collapse-item>
        <n-collapse-item name="filter">
            <template #header>
                <strong>Filter</strong>
            </template>
            <ViewFilterControls />
        </n-collapse-item>
    </n-collapse>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem, NIcon } from 'naive-ui';
import PeopleControls from '@/components/PeopleControls.vue';
import ViewFilterControls from '@/components/ViewFilterControls.vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const toggleSection = ({ name }: { name: string }) => {
    uiStore.toggleViewSection(name);
};
</script>
