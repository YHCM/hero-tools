<script setup>
import { Code, List, Calculator, CircleDot } from 'lucide-vue-next'
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
import { useSidebar } from '@/components/ui/sidebar'

// 获取侧边栏控制方法 - 调整为使用setOpenMobile
const { setOpenMobile, isMobile, openMobile } = useSidebar()

// 侧边导航栏
const items = [
  {
    title: '每日暗号',
    url: '/answer',
    icon: Code,
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
    url: '/skills',
    icon: List,
  },
]

// 处理导航点击事件 - 仅在移动设备的遮罩层模式下关闭侧边栏
const handleNavigation = () => {
  // 只有在移动设备且侧边栏处于打开状态时才关闭
  if (isMobile.value && openMobile.value) {
    setOpenMobile(false)
  }
}
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
                <RouterLink :to="item.url" @click="handleNavigation">
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
