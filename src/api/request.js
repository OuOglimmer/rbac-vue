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
  if (options.method === 'get') {
    options.params = options.params || options.data || {}
    delete options.data
  }
  // 对mock的开关做处理
  let isMock = config.mock
  // 优先使用方法中传递的mock
  if(options.mock !== undefined){
    isMock = options.mock
  }

  // 针对于环境做处理
  if(config.env === 'prod'){
  //  不能mock
  service.defaults.baseURL = config.baseApi
  }else{
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}

export default request;