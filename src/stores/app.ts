import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
    state: () => {
        return {
            hasSelectedItem: false,
            selectedItem: 0,
        }
    },
    actions: {
        toggleItem(id: number): void {
            if (id === this.selectedItem) {
                this.hasSelectedItem = !this.hasSelectedItem;
            } else {
                this.hasSelectedItem = true;
            }
            this.selectedItem = id;
        }
    }
});