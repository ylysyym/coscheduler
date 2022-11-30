<template>
    <n-config-provider
        :theme="store.isDarkMode ? darkTheme : undefined"
        :theme-overrides="themeOverrides"
    >
        <div class="root">
            <NavigationMenu />
            <div class="app-container">
                <n-message-provider>
                    <n-dialog-provider>
                        <RouterView />
                    </n-dialog-provider>
                </n-message-provider>
            </div>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    darkTheme,
    NConfigProvider,
    NDialogProvider,
    NMessageProvider,
} from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { useSettingsStore } from '@/stores/settings';

const store = useSettingsStore();
store.initialise();

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#672bbbFF',
        primaryColorHover: '#7f4dc6FF',
        primaryColorSuppl: '#7f4dc6FF',
        primaryColorPressed: '#5b26a5FF',
        baseColor: '#fff',
        fontWeightStrong: '550',
        borderRadius: '0',
    },
    Collapse: {
        itemMargin: '0',
        dividerColor: '#ffffff00',
    },
};

const background = computed(() => (store.isDarkMode ? '#000' : '#fff'));
const textColor = computed(() => (store.isDarkMode ? '#fff' : '#000'));
</script>

<style scoped>
.root {
    background: v-bind(background);
    color: v-bind(textColor);
    height: 100vh;
    overflow: hidden;
}

.app-container {
    height: calc(100% - 40px);
}
</style>
