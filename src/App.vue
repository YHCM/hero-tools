<script setup>
import { ref, onMounted } from 'vue'
import { getCiphertext } from '@/utils/ciphertext.js'
import answers from '@/assets/data/answers.json'

const ciphertext = ref('')
const answer = ref('')
const loading = ref(true)

// 页面加载时自动获取
onMounted(async () => {
  try {
    const result = await getCiphertext()
    ciphertext.value = result

    // 查找对应答案
    if (answers[result]) {
      answer.value = answers[ciphertext.value]
    }
  } catch (err) {
    console.error('获取失败', err)
    ciphertext.value = '获取失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen p-4 flex items-center justify-center">
    <!-- 内容容器 - 居中显示 -->
    <div class="w-full max-w-md p-6 border rounded-lg shadow-sm">
      <!-- 暗号显示 -->
      <div v-if="ciphertext && !loading" class="text-center p-3 border mb-2 rounded">
        <p>{{ ciphertext }}</p>
      </div>

      <!-- 暗号显示 -->
      <div v-if="answer && !loading" class="text-center p-3 border bg-green-50 rounded">
        <p>{{ answer }}</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center p-3 text-gray-500 border rounded">
        <p>获取中...</p>
      </div>
    </div>
  </div>
</template>
