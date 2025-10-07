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
  <div class="p-4 hover:bg-muted/50 transition-colors">
    <div class="flex items-center gap-2 sm:gap-4 text-sm">
      <span class="flex-1 font-medium">
        {{ skill.name }}
        <span class="text-muted-foreground"> [{{ skill.difficulty }}] </span>
      </span>

      <span class="w-16 mr-1 sm:w-20 text-right text-sm text-muted-foreground">
        {{ skill.currentTrueEssence }}
      </span>

      <NumberField
        :model-value="skill.currentLevel"
        @update:model-value="handleLevelChange('currentLevel', $event)"
        class="w-12 sm:w-16"
        :min="1"
        :max="621"
      >
        <NumberFieldContent class="h-8">
          <NumberFieldInput class="text-center text-sm" />
        </NumberFieldContent>
      </NumberField>

      <NumberField
        :model-value="skill.targetLevel"
        @update:model-value="handleLevelChange('targetLevel', $event)"
        class="w-14 sm:w-16"
        :min="1"
        :max="621"
      >
        <NumberFieldContent class="h-8">
          <NumberFieldInput class="text-center text-sm" />
        </NumberFieldContent>
      </NumberField>
    </div>
  </div>
</template>
