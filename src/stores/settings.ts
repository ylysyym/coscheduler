import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            orientation: 'bottom right',
            dateFormat: '',
            timeFormat: '',
            theme: 'light',
            language: 'en',
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

        setTheme(theme: string) {
            this.theme = theme;
            localStorage.setItem('theme', theme);
        },

        setLanguage(lang: string) {
            this.language = lang;
            localStorage.setItem('language', lang);
        },

        initialise() {
            this.timeFormat = localStorage.getItem('timeFormat') || 'HH:mm';
            this.dateFormat =
                localStorage.getItem('dateFormat') || 'yyyy LLL dd (EEE)';
            this.orientation =
                localStorage.getItem('orientation') || 'bottom right';
            this.theme = localStorage.getItem('theme') || 'light';
            this.language = localStorage.getItem('language') || 'en';
        },
    },

    getters: {
        timestampFormat(): string {
            return this.dateFormat + ', ' + this.timeFormat;
        },

        isDarkMode(): boolean {
            return this.theme === 'dark';
        },
    },
});
