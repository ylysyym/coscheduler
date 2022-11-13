import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            orientation: 'bottom right',
            dateFormat: '',
            timeFormat: '',
        };
    },

    actions: {
        setOrientation(orientation: string) {
            this.orientation = orientation;
            localStorage.setItem('orientation', orientation);
        },

        setDateFormat(format: string) {
            this.dateFormat = format;
            localStorage.setItem('dateFormat', format);
        },

        setTimeFormat(format: string) {
            this.timeFormat = format;
            localStorage.setItem('timeFormat', format);
        },

        initialise() {
            this.timeFormat = localStorage.getItem('timeFormat') || 'HH:mm';
            this.dateFormat =
                localStorage.getItem('dateFormat') || 'yyyy LLL dd (EEE)';
            this.orientation =
                localStorage.getItem('orientation') || 'bottom right';
        },
    },

    getters: {
        timestampFormat(): string {
            return this.dateFormat + ', ' + this.timeFormat;
        },
    },
});
