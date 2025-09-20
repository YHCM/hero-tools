import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 配置路径别名
import path from 'node:path'
// 配置 tailwindcss
import tailwindcss from '@tailwindcss/vite'
// 配置 oklch 兼容
import postcssOkLabFunction from '@csstools/postcss-oklab-function'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // 允许所有域名访问
    allowedHosts: true,
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [postcssOkLabFunction()],
    },
  },
})
