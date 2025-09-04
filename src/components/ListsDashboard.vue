<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Trash } from 'lucide-vue-next'
import { useListsStore } from '@/stores/lists'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const router = useRouter()
const listsStore = useListsStore()

const listToDelete = ref<string | null>(null)
const isDialogOpen = ref(false)

const goToList = (id: string) => router.push({ name: 'ListView', params: { id } })

const confirmDelete = () => {
  if (listToDelete.value) {
    listsStore.deleteList(listToDelete.value)
    listToDelete.value = null
    isDialogOpen.value = false
  }
}

const openDeleteDialog = (id: string) => {
  listToDelete.value = id
  isDialogOpen.value = true
}
</script>

<template>
  <div class="bg-background mx-auto max-w-md p-4">

    <div class="grid grid-cols-2 gap-4">
      <div v-for="list in listsStore.lists" :key="list.id" class="relative" @click="goToList(list.id)">
        <span :class="`absolute -inset-1 ${list.color} rounded-xl z-0`"></span>
        <Card
          class="relative z-10 flex aspect-square cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg">
          <div class="relative">
            <span class="text-foreground font-medium break-words block pr-8">{{ list.name }}</span>

            <Trash class="absolute top-0 right-0 text-foreground size-5 cursor-pointer hover:text-red-500"
              @click.stop="openDeleteDialog(list.id)" />
          </div>
          <span class="text-muted-foreground mt-2 text-sm">{{ list.items }} {{ $t('items') }}</span>
        </Card>
      </div>

      <Card
        class="border-foreground/40 flex cursor-pointer items-center justify-center border-2 border-dashed p-4 transition hover:shadow-lg aspect-square">
        <Button variant="ghost" class="text-foreground flex h-full w-full items-center justify-center"
          @click="router.push({ name: 'NewList' })">
          <Plus class="size-6" />
        </Button>
      </Card>

    </div>
  </div>

  <AlertDialog v-model:open="isDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The list will be permanently deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
