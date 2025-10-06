<script setup>
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/custom/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { useRoute, RouterView } from 'vue-router'

import ThemeToggle from '@/components/custom/ThemeToggle.vue'

// 获取当前路由信息
const route = useRoute()

// 确保面包屑数据始终是数组，避免undefined错误
const getBreadcrumbs = () => {
  return route.meta.breadcrumbs || []
}
</script>

<template>
  <SidebarProvider class="h-screen flex">
    <!-- 左侧侧边栏 -->
    <div>
      <AppSidebar />
    </div>

    <!-- 右侧主内容区 -->
    <SidebarInset class="flex-1 flex flex-col h-full">
      <!-- 上方触发器和面包屑区域 -->
      <header class="border-b p-4 flex items-center justify-between">
        <div class="flex items-center gap-2 h-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />

          <!-- 面包屑导航 -->
          <Breadcrumb>
            <BreadcrumbList>
              <!-- 使用计算属性获取面包屑数据，并添加key -->
              <template v-for="(crumb, index) in getBreadcrumbs()" :key="index">
                <BreadcrumbItem :class="{ 'hidden md:block': index < getBreadcrumbs().length - 1 }">
                  <template v-if="index === getBreadcrumbs().length - 1">
                    <BreadcrumbPage>{{ crumb.label }}</BreadcrumbPage>
                  </template>
                  <template v-else>
                    <BreadcrumbLink :href="crumb.path">{{ crumb.label }}</BreadcrumbLink>
                  </template>
                </BreadcrumbItem>

                <!-- 只在不是最后一项时显示分隔符 -->
                <BreadcrumbSeparator
                  v-if="index < getBreadcrumbs().length - 1"
                  class="hidden md:block"
                />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <!-- 下方路由视图区域 -->
      <div class="flex-1 p-4">
        <RouterView class="h-full w-full" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
