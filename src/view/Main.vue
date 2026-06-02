<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'

</script>

<template>
<div class="common-layout">
  <el-container class="lay-container">
    <!-- 左侧自定义组件 -->
     <common-aside />
     <!-- 右侧自定义组件 -->
     <el-container class="el-container">
      <!-- 顶部自定义组件 -->
      <el-header class="el-header">
        <common-header />
      </el-header>
      <!-- 内容区域 -->
      <el-main class="righ-main">
        <router-view />
      </el-main>
     </el-container>
  </el-container>
</div>
</template>

<style scoped lang="less">
html,body{
  height: 100%;
  width: 100%;
}

.common-layout,
.lay-container{
  height: 100vh;
}
.el-header{
  background-color: #333;
}
</style>
