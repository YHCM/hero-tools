<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useSavesStore } from '@/stores/savesStore'
import SkillList from '@/components/custom/SkillList.vue'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import skillsData from '@/assets/data/skills.json'

const savesStore = useSavesStore()

// 开关状态
const showEssence = ref(true)
const showCurrentEssence = ref(false)

// 计算属性：获取当前存档的技能数据
const currentSkillsData = computed(() => {
  if (!savesStore.currentSaveId) return []
  return savesStore.getSave(savesStore.currentSaveId).skillsData || []
})

// 定义分类的排序顺序
const categoryOrder = ['拳脚', '刀法', '剑法', '棍法', '鞭法', '暗器', '轻功']

// 计算单个技能的基础真元值（不含等级>300的+2）
const calculateBaseEssence = (level, difficulty) => {
  // 基础计算公式：3/10127 * level³ * difficulty
  let essence = (3 / 10127) * Math.pow(level, 3) * difficulty
  return Math.round(essence)
}

// 处理类别内的真元值，确定最大值并调整其他值，最后应用等级>300的+2
const processCategoryEssence = (skills) => {
  // 计算所有技能的当前和目标基础真元值（不含+2）
  const skillsWithBaseEssence = skills.map((skill) => ({
    ...skill,
    baseCurrentEssence: calculateBaseEssence(skill.currentLevel, skill.difficulty),
    baseTargetEssence: calculateBaseEssence(skill.targetLevel, skill.difficulty),
  }))

  // 找出当前和目标真元的最大值
  const maxCurrentEssence = Math.max(...skillsWithBaseEssence.map((s) => s.baseCurrentEssence))
  const maxTargetEssence = Math.max(...skillsWithBaseEssence.map((s) => s.baseTargetEssence))

  // 找到第一个达到当前最大值的技能索引
  const firstMaxCurrentIndex = skillsWithBaseEssence.findIndex(
    (s) => s.baseCurrentEssence === maxCurrentEssence,
  )

  // 找到第一个达到目标最大值的技能索引
  const firstMaxTargetIndex = skillsWithBaseEssence.findIndex(
    (s) => s.baseTargetEssence === maxTargetEssence,
  )

  // 确定最终值：只有第一个最大值保持不变，其他全部减半
  return skillsWithBaseEssence.map((skill, index) => {
    // 计算当前真元：只有第一个最大值完整保留，其他减半
    let currentEssence =
      index === firstMaxCurrentIndex
        ? skill.baseCurrentEssence
        : Math.round(skill.baseCurrentEssence / 2)

    // 计算目标真元：只有第一个最大值完整保留，其他减半
    let targetEssence =
      index === firstMaxTargetIndex
        ? skill.baseTargetEssence
        : Math.round(skill.baseTargetEssence / 2)

    // 如果等级大于300，在最终结果上+2（不会被减半）
    if (skill.currentLevel > 300) {
      currentEssence += 2
    }
    if (skill.targetLevel > 300) {
      targetEssence += 2
    }

    return {
      ...skill,
      currentTrueEssence: currentEssence,
      targetTrueEssence: targetEssence,
    }
  })
}

const baseMartialArts = computed(() => {
  // 获取难度
  const getDifficultyByInsightLevel = (insightArray, insightLevel) => {
    const insight = insightArray.find((item) => item.level === insightLevel)
    if (insight) return insight.difficulty
    if (insightArray.length > 0) return insightArray[insightArray.length - 1].difficulty
    return 1.0
  }

  const categories = {}
  Object.entries(skillsData).forEach(([categoryName, skills]) => {
    // 过滤掉"内功"类别
    if (categoryName === '内功') return

    skills.forEach((skill) => {
      // 只处理存档中存在的技能
      const savedSkill = currentSkillsData.value.find((s) => s.id === skill.id)
      if (!savedSkill) return

      if (!categories[categoryName]) {
        categories[categoryName] = {
          category: categoryName,
          skills: [],
        }
      }

      const difficulty = getDifficultyByInsightLevel(skill.insight, savedSkill?.insightLevel || 0)
      const currentLevel = savedSkill?.currentLevel || 1
      const targetLevel = savedSkill?.targetedLevel || 200

      categories[categoryName].skills.push({
        id: skill.id,
        name: skill.name,
        difficulty,
        currentLevel,
        targetLevel,
        isSaved: !!savedSkill,
      })
    })
  })

  // 按指定顺序排序分类，并处理每个分类的真元值计算
  return Object.values(categories)
    .sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    })
    .map((category) => ({
      ...category,
      skills: processCategoryEssence(category.skills),
    }))
})

// 计算总真元值
const totalCurrentEssence = computed(() => {
  return baseMartialArts.value.reduce((total, category) => {
    return (
      total +
      category.skills.reduce((catTotal, skill) => {
        return catTotal + skill.currentTrueEssence
      }, 0)
    )
  }, 0)
})

const totalTargetEssence = computed(() => {
  return baseMartialArts.value.reduce((total, category) => {
    return (
      total +
      category.skills.reduce((catTotal, skill) => {
        return catTotal + skill.targetTrueEssence
      }, 0)
    )
  }, 0)
})

const martialArts = ref([])

// 初始化 - 默认展开所有分类
onMounted(() => {
  savesStore.initDefaults()
  martialArts.value = baseMartialArts.value.map((cat) => ({
    ...cat,
    open: true, // 默认展开
  }))
})

// 监听基础数据变化并更新
watch(baseMartialArts, (newVal) => {
  martialArts.value = newVal.map((cat) => {
    const existing = martialArts.value.find((c) => c.category === cat.category)
    return {
      ...cat,
      open: existing ? existing.open : true, // 新增分类默认展开
    }
  })
})

// 更新技能数据（通过ID关联）
const updateSkill = (categoryIndex, skillIndex, updatedSkill) => {
  if (!savesStore.currentSaveId) return

  const category = martialArts.value[categoryIndex]
  const skill = category.skills[skillIndex]
  const saveSkillIndex = currentSkillsData.value.findIndex((s) => s.id === skill.id)

  // 获取原有的领悟等级，如果不存在则使用0
  const existingSkill = currentSkillsData.value[saveSkillIndex]
  const existingInsightLevel = existingSkill ? existingSkill.insightLevel : 0

  const skillDataToSave = {
    id: skill.id,
    currentLevel: updatedSkill.currentLevel,
    targetedLevel: updatedSkill.targetLevel,
    insightLevel: existingInsightLevel, // 保留原有的领悟等级
  }

  const updatedSkillsData = [...currentSkillsData.value]

  if (saveSkillIndex > -1) {
    updatedSkillsData[saveSkillIndex] = skillDataToSave
  } else {
    updatedSkillsData.push(skillDataToSave)
  }

  savesStore.updateSkillsData(savesStore.currentSaveId, updatedSkillsData)
}

// 切换分类展开状态
const toggleCategory = (index) => {
  martialArts.value[index].open = !martialArts.value[index].open
}
</script>

<template>
  <div class="w-full mx-auto h-full flex flex-col">
    <!-- 真元显示和开关控制区域 -->
    <div class="px-2 py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
      <div>
        总真元:
        <span :class="{ 'font-bold': !showCurrentEssence }"> 当前: {{ totalCurrentEssence }} </span>
        <span class="mx-1">/</span>
        <span :class="{ 'font-bold': showCurrentEssence }"> 目标: {{ totalTargetEssence }} </span>
      </div>

      <div class="flex items-center gap-3">
        <!-- 是否显示真元开关 -->
        <div class="flex items-center gap-1">
          <span>真元</span>
          <Switch v-model="showEssence" />
        </div>

        <!-- 显示当前/目标真元开关 -->
        <div class="flex items-center gap-1">
          <span
            :class="{ 'font-bold': !showCurrentEssence }"
            @click="showCurrentEssence = false"
            class="cursor-pointer"
            >当前</span
          >
          <Switch v-model="showCurrentEssence" />
          <span
            :class="{ 'font-bold': showCurrentEssence }"
            @click="showCurrentEssence = true"
            class="cursor-pointer"
            >目标</span
          >
        </div>
      </div>
    </div>

    <!-- 因为开关那里会换行，所以移动端是-10rem，而PC端是-8.75rem -->
    <ScrollArea class="flex-1 overflow-y-auto" style="max-height: calc(100vh - 10rem)">
      <div>
        <template v-for="(category, index) in martialArts" :key="category.category">
          <Separator v-if="index > 0" />
          <SkillList
            :category="category"
            :category-index="index"
            :show-essence="showEssence"
            :show-current-essence="showCurrentEssence"
            @toggle-category="toggleCategory"
            @update-skill="updateSkill"
          />
        </template>
      </div>
    </ScrollArea>
  </div>
</template>
