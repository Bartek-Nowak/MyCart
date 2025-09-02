<script setup lang="ts">
import { Plus, Trash } from 'lucide-vue-next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const lists = [
  { id: 1, name: 'Weekly Groceries', items: 12, color: 'border-green-500' },
  { id: 2, name: 'Party Supplies', items: 8, color: 'border-orange-400' },
  { id: 3, name: 'Office Snacks', items: 5, color: 'border-blue-400' },
]
</script>

<template>
  <div class="bg-background mx-auto min-h-screen max-w-md p-4">
    <h1 class="text-foreground mb-4 text-2xl font-semibold">🛒 Your Lists</h1>

    <div class="grid grid-cols-2 gap-4">
      <Card v-for="list in lists" :key="list.id"
        :class="`flex aspect-square cursor-pointer flex-col justify-between border-4 p-4 transition hover:shadow-lg ${list.color}`">
        <div class="flex items-start justify-between">
          <span class="text-foreground font-medium">{{ list.name }}</span>
          <Trash class="text-foreground h-5 w-5 cursor-pointer hover:text-red-500" />
        </div>
        <span class="text-muted-foreground mt-2 text-sm">{{ list.items }} items</span>
      </Card>

      <Card
        class="border-foreground/40 flex cursor-pointer items-center justify-center border-2 border-dashed p-4 transition hover:shadow-lg">
        <Button variant="ghost" class="text-foreground flex h-full w-full items-center justify-center">
          <Plus class="h-6 w-6" />
        </Button>
      </Card>
    </div>
  </div>
</template>
