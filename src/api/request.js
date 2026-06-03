import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config/index.js'

const service = axios.create({
  baseURL: config.baseApi
})
const NETWORK_ERROR = '网络错误'

service.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

service.interceptors.response.use(
  (res) => {
    if (!res || !res.data) {
      ElMessage.error('接口返回数据为空')
      return Promise.reject('接口返回数据为空')
    }
    const { code, data, msg } = res.data
    if (code === 200) {
      return data
    } else {
      ElMessage.error(msg || NETWORK_ERROR)
      return Promise.reject(msg || NETWORK_ERROR)
    }
  },
  (error) => {
    console.log('请求错误 error：', error)
    ElMessage.error(error.message || NETWORK_ERROR)
    return Promise.reject(error)
  }
)

function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data || {}
    delete options.data
  }

  let isMock = config.mock
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }

  if (config.env === 'production') {
    options.baseURL = config.baseApi
  } else {
    options.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options)
}

export default request
