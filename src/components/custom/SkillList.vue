<script setup>
import { ChevronsUpDown } from 'lucide-vue-next'
import SkillListItem from './SkillListItem.vue'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const props = defineProps({
  category: {
    type: Object,
    required: true,
    default: () => ({
      category: '',
      open: false,
      skills: [],
    }),
  },
  categoryIndex: {
    type: Number,
    required: true,
  },
  // 接收开关状态
  showEssence: {
    type: Boolean,
    required: true,
    default: true,
  },
  showCurrentEssence: {
    type: Boolean,
    required: true,
    default: true,
  },
})

const emit = defineEmits(['toggle-category', 'update-skill'])

// 触发分类展开/折叠
const handleToggle = () => {
  emit('toggle-category', props.categoryIndex)
}

// 传递技能更新事件
const handleSkillUpdate = (skillIndex, updatedSkill) => {
  emit('update-skill', props.categoryIndex, skillIndex, updatedSkill)
}
</script>

<template>
  <Collapsible :open="category.open" class="w-full transition-all duration-200">
    <CollapsibleTrigger as-child>
      <Button
        variant="ghost"
        class="w-full justify-between p-3 h-auto hover:no-underline"
        aria-expanded="category.open"
        @click="handleToggle"
      >
        <span class="font-semibold">{{ category.category }}</span>
        <ChevronsUpDown
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': category.open }"
        />
      </Button>
    </CollapsibleTrigger>

    <CollapsibleContent class="p-0">
      <div>
        <template v-for="(skill, skillIndex) in category.skills" :key="skillIndex">
          <Separator v-if="skillIndex > 0" />
          <SkillListItem
            :skill="skill"
            :show-essence="showEssence"
            :show-current-essence="showCurrentEssence"
            @update:skill="handleSkillUpdate(skillIndex, $event)"
          />
        </template>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
