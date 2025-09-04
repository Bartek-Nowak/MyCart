<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper.vue'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { LANGUAGES, THEMES } from '@/config/constants'

const { locale } = useI18n()

const selectedLanguage = ref(locale.value)

const selectedTheme = ref()

watch(selectedLanguage, (newLang) => {
  locale.value = newLang
})

watch(selectedTheme, (newTheme) => {
  const root = document.documentElement

  THEMES.forEach(theme => {
    root.classList.remove(theme.value)
  })
  root.classList.add(newTheme)
})
</script>
<template>
  <PageWrapper :title="$t('settings')">
    <div class="p-4 space-y-4 grid grid-cols-[auto_1fr] gap-4 items-center">

      <Label class="text-sm font-medium text-foreground">{{ $t('theme') }}</Label>
      <Select v-model="selectedTheme" class="w-full">
        <SelectTrigger class="w-full">
          <SelectValue :placeholder="$t('selectTheme')" />
        </SelectTrigger>
        <SelectContent class="w-full">
          <SelectItem v-for="theme in THEMES" :key="theme.value" :value="theme.value">
            {{ $t(theme.label) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Label class="text-sm font-medium text-foreground">{{ $t('language') }}</Label>
      <Select v-model="selectedLanguage" class="w-full">
        <SelectTrigger class="w-full">
          <SelectValue :placeholder="$t('selectLanguage')" />
        </SelectTrigger>
        <SelectContent class="w-full">
          <SelectItem v-for="lang in LANGUAGES" :key="lang.value" :value="lang.value">
            {{ $t(lang.label) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </PageWrapper>
</template>
