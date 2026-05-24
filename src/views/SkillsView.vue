<script setup>
import { ref, computed, onMounted } from 'vue'
import SkillCard from '@/components/custom/SkillCard.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

// 导入技能数据
import skillsData from '@/assets/data/skills.json'

// 状态管理
const selectedCategory = ref('')

// 获取所有技能类别
const categories = computed(() => {
  return Object.keys(skillsData)
})

// 当前选中的技能列表
const filteredSkills = computed(() => {
  return selectedCategory.value ? skillsData[selectedCategory.value] || [] : []
})

// 默认选择第一个类别
onMounted(() => {
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
  }
})
</script>

<template>
  <div class="w-full mx-auto h-full flex flex-col">
    <!-- 类别筛选 -->
    <div class="flex justify-center mb-6">
      <Select v-model="selectedCategory">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="选择技能类别" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- 技能卡片网格 -->
    <ScrollArea class="flex-1 overflow-y-auto" style="max-height: calc(100vh - 10rem)">
      <!-- 网格容器布局 -->
      <div class="grid grid-cols-3 gap-3">
        <SkillCard v-for="skill in filteredSkills" :key="skill.id" :skill="skill" />
      </div>
    </ScrollArea>
  </div>
</template>
