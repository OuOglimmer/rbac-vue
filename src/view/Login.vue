<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { useAllDataStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const loginForm = reactive({
  username: '',
  password: ''
})
const loading = ref(false)
const store = useAllDataStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const res = await proxy.$api.getMenu(loginForm)
    store.updateMenuList(res.menuList)
    store.updateToken(res.token)
    store.addMenu(router)
    router.push({ name: 'home' })
  } catch (err) {
    ElMessage.error(err || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input type="input" placeholder="请输入用户名" v-model="loginForm.username" />
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" @keyup.enter="handleLogin" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.body-login {
  width: 100%;
  height: 100%;
  background: url("../assets/images/login.jpg") no-repeat center center;
  background-size: cover;
  overflow: hidden;
}
.login-container {
  width: 400px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin: 250px auto;
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
}
</style>
