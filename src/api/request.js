import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config/index.js'

const service = axios.create({
  baseURL: config.baseApi
});
const NETWORK_ERROR = '网络错误'

//// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    const{code,msg,data} = res.data
    if(code === 200){
      return data
    }else{
      ElMessage.error(msg || NETWORK_ERROR)
      return Promise.reject(msg || NETWORK_ERROR)
    }
  }
);


function request(options){
  options.method = options.method || 'get'
  // 关于get请求参数的调整,
  if(options.method === 'get'){
    options.params = options.params || {}
  }
  // 判断是否使用 mock
  let isMock = config.mock
  if (options.mock !== undefined) {
    isMock = options.mock
  }

  // 生产环境禁止 mock
  if (config.env === 'prod') {
    isMock = false
  }

  // 根据 isMock 切换 baseURL
  if (!isMock) {
    // 真实后端
    options.baseURL = config.baseApi
  } else if (config.mock) {
    // 本地 Mock.js 模式：走 baseApi，让 Mock.js 拦截 XHR
    options.baseURL = config.baseApi
  } else {
    // 云端 Mock 模式：走 mockApi
    options.baseURL = config.mockApi
  }

  return service(options)
}

export default request;