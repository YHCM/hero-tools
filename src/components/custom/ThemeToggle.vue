<script setup>
import { Moon, Sun } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const mode = useColorMode()

const toggleMode = () => {
  if (
    mode.value === 'dark' ||
    (mode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    mode.value = 'light'
  } else {
    mode.value = 'dark'
  }
}
</script>

<template>
  <Button
    variant="outline"
    @click="toggleMode"
    class="h-8 min-h-[2rem] p-0 w-8 flex items-center justify-center"
  >
    <!-- 月亮图标 -->
    <Moon
      class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <!-- 太阳图标 -->
    <Sun
      class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">切换主题</span>
  </Button>
</template>
