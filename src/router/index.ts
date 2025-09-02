import { createRouter, createWebHistory } from 'vue-router'
import ListsDashboardView from '@/views/ListsDashboardView.vue'
import ListView from '@/views/ListView.vue'
import NewListView from '@/views/NewListView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'ListsDashboard',
    component: ListsDashboardView,
  },
  {
    path: '/list/:id',
    name: 'ListView',
    component: ListView,
    props: true,
  },
  {
    path: '/new-list',
    name: 'NewList',
    component: NewListView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
