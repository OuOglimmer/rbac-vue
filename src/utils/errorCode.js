export function handleBusinessError(code, msg) {
  const strategy = {
    1001: () => ElMessage.error('库存不足'),
    4010: () => {
      ElMessage.error('登录过期')
      router.push('/login')
    }
  }
  if (strategy[code]) strategy[code]()
  else ElMessage.error(msg || '业务错误')
}

export function handleHttpError(error) {
  if (!error.response) {
    ElMessage.error('网络连接失败')
    return
  }
  const status = error.response.status
  if (status === 401) {
    // 跳转登录
  } else if (status === 500) {
    ElMessage.error('服务器内部错误')
  }
  // 其他...
}