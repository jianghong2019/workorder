import { createApp } from 'vue'
import { pinia } from '@/stores/index'
import App from './App.vue'
import router from './router'
import './styles/element/index.scss'
import directives from './utils/directives'
import { provideDict } from '@/composables/useDict'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 注册全局自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key])
})

// 使用 provide 提供全局字典
provideDict(app)

app.mount('#app')
