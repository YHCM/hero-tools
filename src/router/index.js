import { createWebHistory, createRouter } from 'vue-router'

import AnswerView from '@/views/AnswerView.vue'

const routes = [
  { path: '/', redirect: '/answer' },
  {
    path: '/answer',
    component: AnswerView,
    meta: {
      breadcrumbs: [{ label: '每日暗号', path: '/answer' }],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
