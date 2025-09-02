<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListsStore } from '@/stores/lists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import PageWrapper from '@/components/PageWrapper.vue'

const router = useRouter()
const listsStore = useListsStore()

const listName = ref('')
const listColor = ref('border-green-500')

const colors = ['border-green-500', 'border-orange-400', 'border-blue-400', 'border-purple-400']

const createList = () => {
  if (!listName.value) return
  listsStore.addList({
    name: listName.value,
    color: listColor.value,
  })
  router.push({ name: 'ListsDashboard' })
}
</script>

<template>
  <PageWrapper>
    <div class="bg-background mx-auto min-h-screen max-w-md p-4 space-y-4">
      <h1 class="text-2xl font-semibold text-foreground">🆕 Create New List</h1>

      <Card class="p-4 space-y-2">
        <Input v-model="listName" placeholder="List Name" />
        <div class="flex gap-2 mt-2">
          <div v-for="color in colors" :key="color"
            :class="`w-6 h-6 rounded-full shadow cursor-pointer ${color} border-2 ${listColor === color ? 'border-foreground' : 'border-transparent'}`"
            @click="listColor = color" />
        </div>
        <Button class="mt-4 w-full" @click="createList">Create List</Button>
      </Card>
    </div>
  </PageWrapper>
</template>
