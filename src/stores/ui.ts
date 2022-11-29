import { defineStore } from 'pinia';
import { AvailabilityLevel } from '@/models/AvailabilityLevel';
import { useScheduleStore } from './schedule';

const DEFAULT_INITIAL_LEVEL = 0;

export const useUiStore = defineStore('ui', {
    state: () => {
        return {
            selectedItems: new Set() as Set<number>,
            isEditing: false,
            isJoining: false,
            selectedNames: [] as string[],
            userName: '',
            currentEntry: [] as number[],
            selectedTab: 'view',
            currentScheduleId: '',
            expandedViewSections: new Set(['people', 'filter']),
            hoveredItem: -1,
        };
    },

    actions: {
        initialiseBlockData(blockCount: number) {
            this.currentEntry = [];
            for (let i = 0; i < blockCount; i++) {
                this.currentEntry.push(DEFAULT_INITIAL_LEVEL);
            }
        },

        changeLevel(blockIndex: number, level: number) {
            this.currentEntry[blockIndex] = level;
        },

        changeSelectedLevels(level: number) {
            for (const id of this.selectedItems) {
                this.changeLevel(id, level);
            }
        },

        level(index: number): AvailabilityLevel {
            const scheduleStore = useScheduleStore();
            const levels = scheduleStore.levels;
            const availabilityLevel = levels.find((lvl) => {
                return lvl.level === this.currentEntry[index];
            });
            if (availabilityLevel !== undefined) {
                return availabilityLevel;
            }

            return levels[0];
        },

        join() {
            this.isEditing = true;
            this.isJoining = true;
        },

        stopEditing() {
            this.selectedItems.clear();
            this.isEditing = false;
            this.isJoining = false;
            this.userName = '';
            this.changeTab('view');
        },

        clearSelection() {
            for (const item of this.selectedItems) {
                // using clear() causes re-render of all dependent components
                // use delete() as a workaround
                this.selectedItems.delete(item);
            }
        },

        addSelection(id: number) {
            this.selectedItems.add(id);
        },

        removeSelection(id: number) {
            this.selectedItems.delete(id);
        },

        changeTab(tabName: string) {
            this.selectedTab = tabName;
        },

        setScheduleId(id: string) {
            this.currentScheduleId = id;
        },

        toggleViewSection(section: string) {
            if (this.expandedViewSections.has(section)) {
                this.expandedViewSections.delete(section);
            } else {
                this.expandedViewSections.add(section);
            }
        },

        hoverItem(item: number) {
            this.hoveredItem = item;
        },

        unhover() {
            this.hoveredItem = -1;
        },
    },

    getters: {
        hasSelectedItem(): boolean {
            return this.selectedItems.size > 0;
        },

        isInitialData(): boolean {
            return this.currentEntry.every(
                (val) => val === DEFAULT_INITIAL_LEVEL
            );
        },

        firstSelectedItem(): number {
            return this.selectedItems.values().next().value;
        },

        scheduleId: (state) => state.currentScheduleId,

        expandedSections: (state) => Array.from(state.expandedViewSections),

        isHovering: (state) => state.hoveredItem >= 0,
    },
});
