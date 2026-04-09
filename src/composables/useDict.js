import { inject } from 'vue'
import dict from '@/utils/dict'

const DICT_KEY = Symbol('dict')

/**
 * 提供全局字典
 * @param {import('vue').App} app - Vue 应用实例
 */
export function provideDict(app) {
  app.provide(DICT_KEY, dict)
}

/**
 * 使用全局字典
 * @returns {Object} 全局字典对象
 */
export function useDict() {
  const dictData = inject(DICT_KEY, {})

  if (!dictData) {
    console.warn('Dict not provided. Please call provideDict(app) in main.js')
  }

  return dictData
}
