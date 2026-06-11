import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import "./api/mock.js"
import api from "./api/api.js"
import { useAllDataStore } from "@/stores/index.js"
import { getRoleRoutes } from "@/config/roles.js"

// Fix: if user manually types path without hash (e.g. /login), redirect to hash root
if (window.location.pathname !== '/') {
  window.location.replace('/' + (window.location.hash || '#/'))
}

function routeExists(to) {
  return !!router.getRoutes().find(r => r.name === to.name || r.path === to.path)
}

const whitelist = ['login', '404']

router.beforeEach((to, from) => {
  const store = useAllDataStore()
  const token = store.state.token

  if (!token && !whitelist.includes(to.name)) {
    return { name: 'login', replace: true }
  }

  if (token && to.name === 'login') {
    return { name: 'home', replace: true }
  }

  if (token && !store.routesLoaded && !whitelist.includes(to.name)) {
    const restored = store.addMenu(router, "refresh")
    if (restored) {
      return { ...to, replace: true }
    }
    store.clean()
    return { name: 'login', replace: true }
  }

  if (!whitelist.includes(to.name) && !routeExists(to)) {
    return { name: '404', replace: true }
  }

  const roleRoutes = getRoleRoutes(store.state.role)
  if (token && !whitelist.includes(to.name) && to.name && !roleRoutes.includes(to.name)) {
    return { name: '404', replace: true }
  }
})

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
const store = useAllDataStore()
app.config.globalProperties.$api = api

if (store.state.menuList && store.state.menuList.length > 0) {
  store.addMenu(router)
}
app.use(router)

if (store.state.token && !store.routesLoaded) {
  store.addMenu(router, "refresh")
}

app.use(ElementPlus)

app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
