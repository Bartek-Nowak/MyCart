<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useListsStore } from './stores/lists';

const listsStore = useListsStore()

onMounted(async () => {
  await listsStore.initDB()
})
</script>

<template>
  <RouterView />
</template>
