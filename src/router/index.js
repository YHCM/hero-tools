import { createWebHistory, createRouter } from 'vue-router'

import AnswerView from '@/views/AnswerView.vue'

const routes = [
  { path: '/', component: AnswerView },
  { path: '/answer', component: AnswerView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
