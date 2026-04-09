import { defineConfig } from 'eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginTypescript from '@typescript-eslint/eslint-plugin'
import parserTypescript from '@typescript-eslint/parser'

// 导入全局变量定义
const autoImports = {
  globals: {
    // Vue
    ref: 'readonly',
    computed: 'readonly',
    watch: 'readonly',
    onMounted: 'readonly',
    onUnmounted: 'readonly',
    // Vue Router
    useRoute: 'readonly',
    useRouter: 'readonly',
    // Pinia
    defineStore: 'readonly',
    storeToRefs: 'readonly'
  }
}

export default defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    // 允许使用未声明的全局变量（来自自动导入）
    'no-undef': 'off',
    // 其他规则...
  },
  ...autoImports
})
