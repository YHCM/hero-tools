import { createWebHistory, createRouter } from 'vue-router'

// 动态导入
const routes = [
  { path: '/', redirect: '/answer' },
  {
    path: '/answer',
    component: () => import('@/views/AnswerView.vue'),
    meta: {
      breadcrumbs: [{ label: '每日暗号', path: '/answer' }],
    },
  },
  {
    path: '/skills',
    component: () => import('@/views/SkillsView.vue'),
    meta: {
      breadcrumbs: [{ label: '武学列表', path: '/skills' }],
    },
  },
  {
    path: '/calculator',
    component: () => import('@/views/CalculatorView.vue'),
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
