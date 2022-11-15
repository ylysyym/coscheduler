import { defineStore } from 'pinia';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { useScheduleStore } from './schedule';

const DEFAULT_INITIAL_LEVEL = 1;

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
            const scale = scheduleStore.scale;
            const availabilityLevel = scale.levels.find((lvl) => {
                return lvl.level === this.currentEntry[index];
            });
            if (availabilityLevel !== undefined) {
                return availabilityLevel;
            }

            return scale.levels[0];
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
    },
});
