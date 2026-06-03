<template>
  <el-aside :width="width" height="100%">
    <el-menu
      background-color="#a6abaf"
      text-color="#fff"
      :collapse="isCollapsed"
      :collapse-transition="false"
      :default-active="activeMenu"
    >
      <h3 v-show="!isCollapsed">通用后台管理系统</h3>
      <h3 v-show="isCollapsed">通用</h3>
      <el-menu-item
        v-for="item in noChildren"
        :index="item.path"
        :key="item.path"
        @click="handleMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group title="子菜单">
          <el-menu-item
            v-for="(subItem) in item.children"
            :index="subItem.path"
            :key="subItem.path"
            @click="handleMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

const store = useAllDataStore()
const list = computed(() => store.state.menuList)

const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))

const isCollapsed = computed(() => store.state.isCollapsed)
const width = computed(() => isCollapsed.value ? '60px' : '180px')
const activeMenu = computed(() => route.path)

const router = useRouter()
const route = useRoute()

const handleMenu = (item) => {
  router.push(item.path)
  store.selectMenu(item)
}
</script>

<style scoped lang="less">
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  height: 100%;
  border-right: none;
  h3 {
    line-height: 48px;
    color: blue;
    text-align: center;
  }
}
.el-aside {
  height: 100%;
  background-color: #a6abaf;
}
</style>
