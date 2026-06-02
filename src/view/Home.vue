<script setup>
    import { ref, onMounted } from 'vue'
    // 本次登录时间
    const time = new Date()
    
  // 存放登录时间的响应式数据
    const lastLoginTime = ref('')

// 页面加载时读取上次登录时间，同时记录本次登录时间供下一次使用
      onMounted(async () => {
        // 1. 获取访问计数
        try {
          const res = await fetch('http://localhost:3000/api/record-visit')
          const data = await res.json()
          count.value = data.count
        } catch (err) {
          console.error('获取访问次数失败', err)
        }

        // 2. 原有的 lastLoginTime 逻辑
        const savedTime = localStorage.getItem('lastLoginTime')
        if (savedTime) lastLoginTime.value = savedTime
        const now = new Date().toLocaleString()
        localStorage.setItem('lastLoginTime', now)
      })

      

      const count = ref(0)

  
  const getImageUrl = (user) => {
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
  }
</script>


<template>

  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px;"> 
      <!-- 左侧的类表 -->
       <el-card>
        <div class="user">
          <img :src="getImageUrl('user')" alt="用户头像">
          <div class="user-info">
            <p>管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>登录时间：{{ time.toLocaleString() }}</p>
          <p>上一次登录时间：{{ lastLoginTime }}</p>
          <p>被访问的次数：{{ count }}<span>次</span></p>
        </div>
       </el-card>
    </el-col>
  </el-row>

</template>


<style scoped lang="less">
  .home{
    height: 100%;
    overflow: hidden;
    .user{
      display: flex;
      align-items: center;   
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      img{
        width: 150px;
        height: 150px;
        border-radius: 10px;
        margin-right: 20px;
      }
    }
    .login-info{
      margin-top: 20px;
      font-size: 14px;
      color: #666;
      span{
       color: #666;
       margin-left: 10px;
      }
    }
  }
</style>