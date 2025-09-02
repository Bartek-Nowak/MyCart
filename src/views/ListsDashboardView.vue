<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Settings } from 'lucide-vue-next'
import ListsDashboard from '@/components/ListsDashboard.vue'

const router = useRouter()

const goToSettings = () => {
  router.push({ name: 'Settings' })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="flex justify-between items-center gap-4 p-4 border-b border-muted-foreground/20">
      <h1 class="text-2xl font-semibold text-foreground">🛒 {{ $t('myLists') }}</h1>

      <button class="p-1 rounded hover:bg-muted-foreground/10" @click="goToSettings">
        <Settings class="size-6 text-foreground" />
      </button>
    </header>

    <main class="p-4">
      <ListsDashboard />
    </main>
  </div>
</template>
