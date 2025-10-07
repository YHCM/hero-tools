import { createWebHistory, createRouter } from 'vue-router'

import AnswerView from '@/views/AnswerView.vue'
import SkillsView from '@/views/SkillsView.vue'
import CalculatorView from '@/views/CalculatorView.vue'

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
  {
    path: '/calculator',
    component: CalculatorView,
    meta: {
      breadcrumbs: [{ label: '真元计算', path: '/calculator' }],
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
