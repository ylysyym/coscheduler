import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            selectedItems: new Set() as Set<number>,
            isEditing: false,
            isJoining: false,
            selectedNames: [] as string[],
            userName: '',
            originalEntry: [] as number[],
        };
    },

    actions: {
        joinAs(name: string) {
            this.isEditing = true;
            this.isJoining = true;
            this.userName = name;
            this.selectedNames = [name];
        },

        stopEditing() {
            this.selectedItems.clear();
            this.isEditing = false;
            this.isJoining = false;
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
    },
});
