import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // ref state 属性
  // computed  getters计算属性
  // function actions 方法
  const isCollapse = ref(false);  
  // actions 方法
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }
  return { isCollapse, toggleCollapse }
})

