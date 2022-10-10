import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            selectedItems: [] as number[],
            isEditMode: false,
            currentName: '',
            isJoining: false,
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

        startJoin(name: string) {
            this.isEditMode = true;
            this.isJoining = true;
            this.currentName = name;
        },

        stopEditing() {
            this.isEditMode = false;
            this.isJoining = false;
        },
    },

    getters: {
        hasSelectedItem(): boolean {
            return this.selectedItems.length > 0;
        },

        isEditing(): boolean {
            return this.isEditMode;
        },

        isJoin(): boolean {
            return this.isJoining;
        },

        name(): string {
            return this.currentName;
        },
    },
});
