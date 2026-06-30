import { createRouter, createWebHistory } from 'vue-router'
import CharGrid from '../components/CharGrid.vue'

const routes = [
  { path: '/', component: CharGrid },
  {
    path: '/allusion/:id',
    component: () => import('../pages/AllusionPage.vue'),
    props: true,
  },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
