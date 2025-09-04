<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useListsStore } from './stores/lists';
import { useSettingsStore } from './stores/settings';

const listsStore = useListsStore()
const settingsSore = useSettingsStore()

onMounted(async () => {
  await listsStore.initDB()
  await settingsSore.initDB()
})
</script>

<template>
  <RouterView />
</template>
