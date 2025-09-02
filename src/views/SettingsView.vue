<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper.vue'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const { locale } = useI18n()

const languages = [
  { label: 'english', value: 'en' },
  { label: 'polish', value: 'pl' },
]

const selectedLanguage = ref(locale.value)

watch(selectedLanguage, (newLang) => {
  locale.value = newLang
})
</script>
<template>
  <PageWrapper :title="$t('settings')">
    <div class="p-4 space-y-4">
      <div class="flex items-center w-full gap-4">
        <Label class="text-sm font-medium text-foreground">{{ $t('language') }}</Label>
        <Select v-model="selectedLanguage" class="flex-1">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="$t('selectLanguage')" />
          </SelectTrigger>
          <SelectContent class="w-full">
            <SelectItem v-for="lang in languages" :key="lang.value" :value="lang.value">
              {{ $t(lang.label) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </PageWrapper>
</template>
