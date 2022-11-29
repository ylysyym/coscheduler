import { getScale } from 'color2k';
import { defineStore } from 'pinia';
import { presetScale } from '@/models/palettes/presetScale';

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            orientation: 'bottom right',
            dateFormat: '',
            timeFormat: '',
            theme: 'light',
            language: 'en',
            colorMap: 'viridis' as string | string[],
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

        setColorMap(map: string | string[]) {
            this.colorMap = map;
            localStorage.setItem('colorMap', JSON.stringify(map));
        },

        initialise() {
            this.timeFormat = localStorage.getItem('timeFormat') || 'HH:mm';
            this.dateFormat =
                localStorage.getItem('dateFormat') || 'yyyy LLL dd (EEE)';
            this.orientation =
                localStorage.getItem('orientation') || 'bottom right';
            this.theme = localStorage.getItem('theme') || 'light';
            this.language = localStorage.getItem('language') || 'en';
            const colorMap = localStorage.getItem('colorMap');
            this.colorMap = colorMap ? JSON.parse(colorMap) : 'viridis';
        },
    },

    getters: {
        isDarkMode(): boolean {
            return this.theme === 'dark';
        },

        colorScale(): (value: number) => string {
            if (Array.isArray(this.colorMap)) {
                return getScale(...this.colorMap);
            } else {
                return presetScale(this.colorMap);
            }
        },
    },
});
