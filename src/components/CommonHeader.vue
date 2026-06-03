<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small" @click="handleCollapse">
        <component class="icons" :is="Menu">  </component>
      </el-button>
        <!-- 面包屑 -->
          <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          </el-breadcrumb>    
    </div>

    <!-- 右侧用户头像 -->
    <div class="r-content">
       <el-dropdown>
          <span class="el-dropdown-link">
            <img :src="getImageUrl('user')" class="user">
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { Menu } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { useCounterStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
const store = useCounterStore()
const { isCollapse, toggleCollapse } = storeToRefs(store)
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href
}
const handleCollapse = () => {
  store.toggleCollapse()
}
</script>

<style scoped lang="less">
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
}
.icons{
  width: 20px;
  height: 20px;
}
.l-content{
  display: flex;
  align-items: center;
  el-button{
    margin-right: 10px;
  }
}
.r-content{
  .user{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

:deep(.bread span){
  color: #fff !important;
  cursor: pointer !important;
}
</style>