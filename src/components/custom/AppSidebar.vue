<script setup>
import { Sun, List, Calculator, CircleDot } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// 侧边导航栏
const items = [
  {
    title: '每日暗号',
    url: '/answer',
    icon: Sun,
  },
  {
    title: '真元计算',
    url: '/answer',
    icon: Calculator,
  },
  {
    title: '经脉模拟',
    url: '/answer',
    icon: CircleDot,
  },
  {
    title: '武学列表',
    url: '/answer',
    icon: List,
  },
]
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>暴走工具</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
