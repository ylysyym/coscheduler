<template>
    <n-space size="large">
        <n-popover trigger="click" :show-arrow="false" raw>
            <template #trigger>
                <n-button color="#672bbb" icon-placement="right">
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
                    <div class="menu-item">Theme</div>
                    <div class="menu-item">
                        <div class="sub-item-label">Language</div>
                        <div class="sub-item">
                            <n-select />
                        </div>
                    </div>
                </n-list-item>
                <n-list-item class="compact-list-item">
                    <router-link class="menu-item" to="/about">
                        About
                    </router-link>
                    <router-link class="menu-item" to="/settings">
                        Settings
                    </router-link>
                </n-list-item>
            </n-list>
        </n-popover>
        <n-button type="primary" @click="$router.push('/create')">
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
            Create
        </n-button>
    </n-space>
</template>

<script setup lang="ts">
import {
    NButton,
    NIcon,
    NList,
    NListItem,
    NPopover,
    NSelect,
    NSpace,
} from 'naive-ui';
</script>

<style scoped>
.logo {
    background: #672bbb;
    color: #fff;
    display: inline-block;
    padding: 8px;
}

.compact-list-item {
    padding: 0;
}

.menu {
    min-width: 240px;
}

.menu-item {
    align-items: center;
    color: #333;
    display: flex;
    padding: 8px 12px;
    text-decoration: none;
}

.menu-item:hover {
    background: #8656ad;
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
}
</style>
