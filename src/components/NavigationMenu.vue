<template>
    <n-space class="container">
        <n-popover ref="popover" trigger="click" :show-arrow="false" raw>
            <template #trigger>
                <n-button
                    color="#672bbb"
                    icon-placement="right"
                    class="menu-button"
                >
                    <template #icon>
                        <n-icon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 12 12"
                            >
                                <g fill="none">
                                    <path
                                        d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06z"
                                        fill="currentColor"
                                    ></path>
                                </g>
                            </svg>
                        </n-icon>
                    </template>
                    coscheduler
                </n-button>
            </template>
            <n-list class="menu">
                <n-list-item class="compact-list-item">
                    <div class="menu-item">
                        <div class="sub-item-label">Theme</div>
                        <div class="sub-item">
                            <n-button-group>
                                <n-button
                                    @click="settings.setTheme('light')"
                                    :type="
                                        selectedTheme === 'light'
                                            ? 'primary'
                                            : 'default'
                                    "
                                >
                                    <n-icon>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </n-icon>
                                </n-button>
                                <n-button
                                    @click="settings.setTheme('dark')"
                                    :type="
                                        selectedTheme === 'dark'
                                            ? 'primary'
                                            : 'default'
                                    "
                                >
                                    <n-icon>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </n-icon>
                                </n-button>
                            </n-button-group>
                        </div>
                    </div>
                    <div class="menu-item">
                        <div class="sub-item-label">Language</div>
                        <div class="sub-item">
                            <n-select
                                :options="languageOptions"
                                v-model:value="selectedLanguage"
                                @update:value="
                                    settings.setLanguage(selectedLanguage)
                                "
                            />
                        </div>
                    </div>
                </n-list-item>
                <n-list-item class="compact-list-item" @click="closeMenu">
                    <router-link class="selectable menu-item" to="/about">
                        About
                    </router-link>
                    <router-link class="selectable menu-item" to="/settings">
                        Settings
                    </router-link>
                </n-list-item>
            </n-list>
        </n-popover>
        <router-link to="/create" v-slot="{ href, navigate }">
            <n-button type="primary" @click="navigate" :href="href">
                <template #icon>
                    <n-icon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 16 16"
                        >
                            <g fill="none">
                                <path
                                    d="M8.5 2.75a.75.75 0 0 0-1.5 0V7H2.75a.75.75 0 0 0 0 1.5H7v4.25a.75.75 0 0 0 1.5 0V8.5h4.25a.75.75 0 0 0 0-1.5H8.5V2.75z"
                                    fill="currentColor"
                                ></path>
                            </g>
                        </svg>
                    </n-icon>
                </template>
                Create schedule
            </n-button>
        </router-link>
    </n-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    NButton,
    NButtonGroup,
    NIcon,
    NList,
    NListItem,
    NPopover,
    NSelect,
    NSpace,
} from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';

const settings = useSettingsStore();

const popover = ref<InstanceType<typeof NPopover>>();

const closeMenu = () => {
    popover.value?.setShow(false);
};

const selectedLanguage = ref(settings.language);

const languageOptions = ref([
    {
        label: 'English',
        value: 'en',
    },
    {
        label: '日本語',
        value: 'ja',
    },
]);

const selectedTheme = computed(() => settings.theme);
</script>

<style scoped>
.container {
    height: 32px;
    padding: 4px;
    width: 400px;
}

.menu-button {
    border-radius: 0;
}

.compact-list-item {
    padding: 0;
}

.menu {
    min-width: 240px;
    user-select: none;
}

.menu-item {
    align-items: center;
    color: #333;
    display: flex;
    padding: 4px 12px;
    text-decoration: none;
}

.selectable.menu-item {
    padding: 8px 12px;
}

.selectable.menu-item:hover {
    background: rgba(127, 77, 198, 1);
    color: #fff;
}

.router-link-active {
    background: rgb(238, 238, 238);
    color: #000;
}

.sub-item-label {
    display: inline-flex;
    padding-right: 12px;
}
.sub-item {
    display: inline-flex;
    flex-grow: 1;
    justify-content: right;
}

a {
    text-decoration: none;
}
</style>
