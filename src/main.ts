import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pl from './locales/pl.json'

import App from './App.vue'
import { router } from './router'

const i18n = createI18n({
  locale: 'pl',
  fallbackLocale: 'en',
  messages: { en, pl },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(i18n)
app.mount('#app')
