<!-- <script setup>
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/custom/AppSidebar.vue'
</script>

<template>
  <SidebarProvider class="h-screen">
    <AppSidebar />
    <main class="flex h-full">
      <SidebarTrigger />
      <RouterView />
    </main>
  </SidebarProvider>
</template> -->

<script setup>
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/custom/AppSidebar.vue'
</script>

<template>
  <SidebarProvider class="h-screen flex">
    <!-- 左侧侧边栏 -->
    <div class="z-10">
      <AppSidebar />
    </div>

    <!-- 右侧主内容区 - 上下布局 -->
    <main class="flex-1 flex flex-col h-full">
      <!-- 上方触发器区域 -->
      <header class="border-b p-4 flex items-center">
        <SidebarTrigger class="justify-start" />
      </header>

      <!-- 下方路由视图区域 -->
      <div class="flex-1 p-4">
        <RouterView class="h-full w-full" />
      </div>
    </main>
  </SidebarProvider>
</template>
