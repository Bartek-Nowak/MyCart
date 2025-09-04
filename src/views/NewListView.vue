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
const listColor = ref('bg-red-500')

const colors = [
  'bg-red-500', 'bg-orange-500',
  'bg-yellow-400', 'bg-lime-500', 'bg-green-500',
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
  'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500',
  'bg-red-700', 'bg-green-700', 'bg-blue-700', 'bg-purple-700',
  'bg-red-300', 'bg-green-300', 'bg-blue-300', 'bg-pink-300'
]

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
  <PageWrapper :title="$t('createNewListTitle')">
    <div class="bg-background mx-auto max-w-md p-4 space-y-4">
      <Card class="p-4 space-y-4">
        <Input v-model="listName" :placeholder="$t('listNamePlaceholder')" />
        <div class="flex flex-wrap gap-3 mt-2">
          <div v-for="color in colors" :key="color" :class="[
            'w-10 h-10 rounded-full cursor-pointer transition-all duration-200 shadow-md',
            color,
            listColor === color ? 'ring-4 ring-foreground scale-110' : 'hover:scale-105'
          ]" @click="listColor = color" />
        </div>

        <Button class="mt-4 w-full" @click="createList">{{ $t('createListButton') }}</Button>
      </Card>
    </div>
  </PageWrapper>
</template>
