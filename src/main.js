import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "element-plus/dist/index.css"
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
import api from './api/api.js'
import config from './config/index.js'

async function bootstrap() {
  if (config.mock) {
    await import('./api/mock.js')
  }

  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)
  app.config.globalProperties.api = api

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.mount('#app')
}
bootstrap()

