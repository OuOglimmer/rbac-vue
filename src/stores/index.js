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
    routerList: []
  }
}

export const useAllDataStore = defineStore('allData', () => {
  const state = ref(initState())

  watch(state, (newObj) => {
    if (!newObj.token) return
    localStorage.setItem('store', JSON.stringify(newObj))
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

  function addMenu(router, type) {
    if (type == "refresh") {
      if (JSON.parse(localStorage.getItem('store'))) {
        state.value = JSON.parse(localStorage.getItem('store'))
        state.value.routerList = []
      } else {
        return
      }
    }
    const menu = state.value.menuList
    const modules = import.meta.glob('../view/**/*.vue')
    const routerArr = []

    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const url = `../view/${child.url}.vue`
          child.component = modules[url]
          routerArr.push(child)
        })
      } else {
        const url = `../view/${item.url}.vue`
        item.component = modules[url]
        routerArr.push(item)
      }
    })

    state.value.routerList.forEach((removeRoute) => {
      if (removeRoute) removeRoute()
    })
    state.value.routerList = []

    routerArr.forEach((item) => {
      if (item.component) {
        const removeRoute = router.addRoute('main', item)
        state.value.routerList.push(removeRoute)
      } else {
        console.warn(`没有找到组件：${item.url}`)
      }
    })
  }

  function clean() {
    state.value.routerList.forEach(item => {
      if (item) item()
    })
    state.value = initState()
    localStorage.removeItem('store')
  }

  function updateToken(val) {
    state.value.token = val
  }

  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    updateToken,
    addMenu,
    clean,
  }
})
