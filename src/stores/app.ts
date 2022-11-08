import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { AvailabilityScale } from '@/models/availability/AvailabilityScale';
import { defineStore } from 'pinia';

const DEFAULT_INITIAL_LEVEL = 1;

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            selectedItems: new Set() as Set<number>,
            isEditing: false,
            isJoining: false,
            selectedNames: [] as string[],
            userName: '',
            currentEntry: [] as number[],
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

        changeMultipleLevels(blocks: Set<number>, level: number) {
            for (const id of blocks) {
                this.changeLevel(id, level);
            }
        },

        level(index: number, scale: AvailabilityScale): AvailabilityLevel {
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
    },
});
