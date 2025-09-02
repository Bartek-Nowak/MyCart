import { createRouter, createWebHistory } from 'vue-router'
import ListsDashboardView from '@/views/ListsDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'listsDashboard',
      component: ListsDashboardView,
    },
  ],
})

export default router
