<template>
    <div class="root">
        <div class="menu">Placeholder</div>
        <div class="block-grid">
            <BlockGrid />
        </div>
        <div class="detail-panel">
            <DetailPanel />
        </div>
    </div>
</template>

<script setup lang="ts">
import BlockGrid from '@/blocks/BlockGrid.vue';
import DetailPanel from '@/DetailPanel.vue';
</script>

<style scoped>
.root {
    height: 100vh;
    overflow: hidden;
}

.menu {
    height: 40px;
}

.block-grid,
.detail-panel {
    display: inline-block;
    vertical-align: top;
    width: 100%;
}
@media (min-width: 960px) {
    .block-grid,
    .detail-panel {
        height: calc(100% - 40px);
    }
    .block-grid {
        width: calc(100% - 300px);
    }
    .detail-panel {
        width: 300px;
    }
}
</style>
