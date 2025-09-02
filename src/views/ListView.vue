<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trash } from 'lucide-vue-next'
import { useListsStore } from '@/stores/lists'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import PageWrapper from '@/components/PageWrapper.vue'

const route = useRoute()
const router = useRouter()
const listsStore = useListsStore()

const listId = route.params.id as string
const currentList = computed(() => listsStore.lists.find(list => list.id === listId))

const newProductName = ref('')
const newProductQuantity = ref<number | null>(1)
const newProductUnit = ref('pcs')

const units = ['pcs', 'kg', 'g', 'L']

const addProduct = () => {
  if (!newProductName.value || !newProductQuantity.value || !currentList.value) return
  listsStore.addProduct(listId, {
    name: newProductName.value,
    quantity: `${newProductQuantity.value} ${newProductUnit.value}`
  })
  newProductName.value = ''
  newProductQuantity.value = null
  newProductUnit.value = 'pcs'
}

const deleteProduct = (productId: string) => {
  listsStore.deleteProduct(listId, productId)
}

const numberFieldProps = computed(() => {
  switch (newProductUnit.value) {
    case 'pcs':
      return { step: 1, min: 1, precision: 0 }
    case 'kg':
      return { step: 0.5, min: 0.5, precision: 1 }
    case 'g':
      return { step: 10, min: 10, precision: 0 }
    case 'L':
      return { step: 0.1, min: 0.1, precision: 1 }
    default:
      return { step: 1, min: 1, precision: 0 }
  }
})

onMounted(() => {
  if (!currentList.value) {
    router.push({ name: 'ListsDashboard' })
  }
})
</script>

<template>
  <PageWrapper>
    <div class="bg-background min-h-screen p-4 max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-semibold text-foreground">
        {{ currentList?.name || 'List not found' }}
      </h1>

      <div v-if="currentList">
        <p class="text-muted-foreground">Number of items: {{ currentList.items }}</p>

        <div class="mt-4 space-y-2">
          <Input v-model="newProductName" placeholder="Product name" class="w-full" />

          <div class="flex gap-2">
            <NumberField v-model="newProductQuantity" :min="numberFieldProps.min" :step="numberFieldProps.step"
              :default-value="numberFieldProps.min"
              :format-options="{ minimumFractionDigits: numberFieldProps.precision, maximumFractionDigits: numberFieldProps.precision }"
              class="flex-1">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>

            <Select v-model="newProductUnit" class="flex-1">
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="unit in units" :key="unit" :value="unit">{{ unit }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button class="w-full" @click="addProduct">Add</Button>
        </div>

        <ul class="mt-4 space-y-2">
          <li v-for="product in currentList.products" :key="product.id"
            class="flex justify-between items-center p-2 border rounded">
            <div>
              <span class="font-medium text-foreground">{{ product.name }}</span>
              <span class="ml-2 text-sm text-muted-foreground">{{ product.quantity }}</span>
            </div>
            <Trash class="h-5 w-5 cursor-pointer text-red-500" @click="deleteProduct(product.id)" />
          </li>
        </ul>
      </div>
    </div>
  </PageWrapper>
</template>
