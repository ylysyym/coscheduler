import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            selectedItems: [] as number[],
            isEditing: false,
            isJoining: false,
            selectedNames: [] as string[],
            userName: '',
            originalEntry: [] as number[],
        };
    },

    actions: {
        selectItem(id: number): void {
            this.selectedItems = [id];
        },

        selectItems(ids: number[]): void {
            this.selectedItems = ids;
        },

        toggleItem(id: number): void {
            if (this.selectedItems.includes(id)) {
                this.selectedItems = this.selectedItems.filter((i) => i !== id);
            } else {
                this.selectedItems.push(id);
            }
        },

        joinAs(name: string) {
            this.isEditing = true;
            this.isJoining = true;
            this.userName = name;
            this.selectedNames = [name];
        },

        stopEditing() {
            this.isEditing = false;
            this.isJoining = false;
        },
    },

    getters: {
        hasSelectedItem(): boolean {
            return this.selectedItems.length > 0;
        },
    },
});
