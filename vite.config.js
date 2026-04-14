import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  base: '/workorder/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/var.scss" as *;
        @use "@/styles/index.scss" as *;
        `,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      resolvers: [
        // Auto import Element Plus components
        // 自动导入Element Plus组件和图标
        ElementPlusResolver({
          importStyle: false,
          // directives: true,
          // version: "2.1.5",
        }),
      ],
      dts: './auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false,
          // directives: true,
          // version: "2.1.5",
        }),
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
          prefix: '',
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      scale: 1.2,
      defaultClass: 'inline-block'
    }),
  ]
})
