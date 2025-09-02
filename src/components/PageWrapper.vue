<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="flex items-center gap-4 p-4 border-b border-muted-foreground/20">
      <button @click="router.back()" class="p-1 rounded hover:bg-muted-foreground/10">
        <ArrowLeft class="w-5 h-5 text-foreground" />
      </button>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
