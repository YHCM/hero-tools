<script setup>
import { ref } from 'vue'
import SkillList from '@/components/custom/SkillList.vue'
import { Separator } from '@/components/ui/separator'

// 所有数据在视图中管理
const martialArts = ref([
  {
    category: '拳脚',
    open: false,
    skills: [
      {
        name: '咏春拳',
        difficulty: 1.5,
        currentLevel: 1,
        targetLevel: 299,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '七杀拳',
        difficulty: 2.0,
        currentLevel: 1,
        targetLevel: 350,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '虾米拳法',
        difficulty: 1.2,
        currentLevel: 1,
        targetLevel: 200,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '伊贺体术',
        difficulty: 3.0,
        currentLevel: 1,
        targetLevel: 450,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '金蛟游龙掌',
        difficulty: 2.5,
        currentLevel: 1,
        targetLevel: 400,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
    ],
  },
  {
    category: '刀法',
    open: false,
    skills: [
      {
        name: '庖丁刀法',
        difficulty: 2.2,
        currentLevel: 1,
        targetLevel: 380,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '疾风刀法',
        difficulty: 2.8,
        currentLevel: 1,
        targetLevel: 420,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '血魔刀法',
        difficulty: 3.5,
        currentLevel: 1,
        targetLevel: 500,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
      {
        name: '忍影三刀流',
        difficulty: 3.2,
        currentLevel: 1,
        targetLevel: 480,
        currentTrueEssence: 10031,
        targetTrueEssence: 10031,
      },
    ],
  },
])

// 更新技能数据
const updateSkill = (categoryIndex, skillIndex, updatedSkill) => {
  martialArts.value[categoryIndex].skills[skillIndex] = updatedSkill
}

// 切换分类展开状态
const toggleCategory = (index) => {
  martialArts.value[index].open = !martialArts.value[index].open
}
</script>

<template>
  <div class="w-full">
    <div>
      <!-- 每个分类都是一个 SkillList 组件 -->
      <template v-for="(category, index) in martialArts" :key="index">
        <Separator v-if="index > 0" />
        <SkillList
          :category="category"
          :category-index="index"
          @toggle-category="toggleCategory"
          @update-skill="updateSkill"
        />
      </template>
    </div>
  </div>
</template>
