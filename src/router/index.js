import { createWebHistory, createRouter } from 'vue-router'

import AnswerView from '@/views/AnswerView.vue'
import SkillsView from '@/views/SkillsView.vue'

const routes = [
  { path: '/', redirect: '/answer' },
  {
    path: '/answer',
    component: AnswerView,
    meta: {
      breadcrumbs: [{ label: '每日暗号', path: '/answer' }],
    },
  },
  {
    path: '/skills',
    component: SkillsView,
    meta: {
      breadcrumbs: [{ label: '武学列表', path: '/skills' }],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
