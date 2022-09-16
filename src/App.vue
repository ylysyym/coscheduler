<template>
    <BlockGrid class="block-grid" />
    <DetailPanel class="detail-panel" />
</template>

<script setup lang="ts">
import BlockGrid from '@/blocks/BlockGrid.vue';
import DetailPanel from '@/DetailPanel.vue';
</script>

<style scoped>
.detail-panel {
    width: 100%;
}
@media screen and (min-width: 960px) {
    .detail-panel {
        width: 300px;
    }
}
</style>
