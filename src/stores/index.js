import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function initState() {
  return {
    isCollapsed: false,
    tags: [{
      path: '/home',
      name: 'home',
      label: '首页',
      icon: 'home',
    }],
    currentMenu: null,
    menuList: [],
    token: "",
    role: "",
    userInfo: null,
    routerList: []
  }
}

function restoreFromStorage() {
  try {
    const saved = localStorage.getItem('store')
    if (!saved) return null
    const parsed = JSON.parse(saved)
    if (!parsed || !parsed.token) return null
    return parsed
  } catch {
    return null
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())
  const routesLoaded = ref(false)

  watch(state, (newObj) => {
    if (!newObj.token) return
    const { routerList: _, ...persistable } = newObj
    localStorage.setItem('store', JSON.stringify(persistable))
  }, { deep: true })

  function selectMenu(val) {
    if (val.name == "home") {
      state.value.currentMenu = null
    } else {
      let index = state.value.tags.findIndex(item => item.name == val.name)
      index === -1 ? state.value.tags.push(val) : ""
    }
  }

  function updateTags(tag) {
    let index = state.value.tags.findIndex((item) => item.name == tag.name)
    state.value.tags.splice(index, 1)
  }

  function updateMenuList(val) {
    state.value.menuList = val
  }

  function restoreRoutes(router) {
    const saved = restoreFromStorage()
    if (!saved) return false

    state.value.isCollapsed = saved.isCollapsed ?? false
    state.value.tags = saved.tags ?? [{ path: '/home', name: 'home', label: '首页', icon: 'home' }]
    state.value.currentMenu = saved.currentMenu ?? null
    state.value.menuList = saved.menuList ?? []
    state.value.token = saved.token ?? ""
    state.value.role = saved.role ?? ""
    state.value.userInfo = saved.userInfo ?? null
    state.value.routerList = []

    if (!state.value.menuList.length) return false

    return rebuildRoutes(router)
  }

  function rebuildRoutes(router) {
    state.value.routerList.forEach(fn => { if (fn) fn() })
    state.value.routerList = []

    const menu = state.value.menuList
    const modules = import.meta.glob('../view/**/*.vue')

    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const url = `../view/${child.url}.vue`
          child.component = modules[url]
          routerArrPush(child)
        })
      } else {
        const url = `../view/${item.url}.vue`
        item.component = modules[url]
        routerArrPush(item)
      }
    })

    function routerArrPush(item) {
      if (item.component) {
        const removeRoute = router.addRoute('main', item)
        state.value.routerList.push(removeRoute)
      } else {
        console.warn(`没有找到组件：${item.url}`)
      }
    }

    routesLoaded.value = true
    return true
  }

  function loadRoutesFromMenu(router) {
    if (!state.value.menuList.length) return false
    return rebuildRoutes(router)
  }

  function addMenu(router, type) {
    if (type == "refresh") {
      return restoreRoutes(router)
    }
    return loadRoutesFromMenu(router)
  }

  function clean() {
    state.value.routerList.forEach(fn => { if (fn) fn() })
    state.value.routerList = []
    state.value = initState()
    routesLoaded.value = false
    localStorage.removeItem('store')
  }

  function updateToken(val) {
    state.value.token = val
  }

  function updateRole(val) {
    state.value.role = val
  }

  function updateUserInfo(val) {
    state.value.userInfo = val
  }

  return {
    state,
    routesLoaded,
    selectMenu,
    updateTags,
    updateMenuList,
    updateToken,
    updateRole,
    updateUserInfo,
    addMenu,
    clean,
  }
})
