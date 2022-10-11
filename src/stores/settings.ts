import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            orientation: 'bottom right',
        };
    },

    actions: {
        setOrientation(orientation: string) {
            this.orientation = orientation;
        },
    },
});
