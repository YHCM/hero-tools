<script setup>
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'

const props = defineProps({
  skill: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      difficulty: 1.0,
      currentLevel: 1,
      targetLevel: 100,
      currentTrueEssence: 0,
      targetTrueEssence: 0,
    }),
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

const emit = defineEmits(['update:skill'])

// 处理等级变化
const handleLevelChange = (field, value) => {
  emit('update:skill', {
    ...props.skill,
    [field]: value,
  })
}
</script>

<template>
  <div class="p-3 hover:bg-muted/50 transition-colors">
    <div class="flex items-center gap-1 sm:gap-2 text-sm">
      <span class="flex-1 font-medium truncate">
        {{ skill.name }}
        <span class="text-muted-foreground"> [{{ skill.difficulty }}] </span>
      </span>

      <!-- 根据开关状态显示相应的真元值 -->
      <span v-if="showEssence" class="w-14 sm:w-16 text-right text-sm text-muted-foreground">
        {{ !showCurrentEssence ? skill.currentTrueEssence : skill.targetTrueEssence }}
      </span>

      <NumberField
        :model-value="skill.currentLevel"
        @update:model-value="handleLevelChange('currentLevel', $event)"
        class="w-12"
        :min="1"
        :max="621"
      >
        <NumberFieldContent class="h-7">
          <NumberFieldInput class="text-center text-sm" />
        </NumberFieldContent>
      </NumberField>

      <NumberField
        :model-value="skill.targetLevel"
        @update:model-value="handleLevelChange('targetLevel', $event)"
        class="w-12"
        :min="1"
        :max="621"
      >
        <NumberFieldContent class="h-7">
          <NumberFieldInput class="text-center text-sm" />
        </NumberFieldContent>
      </NumberField>
    </div>
  </div>
</template>
