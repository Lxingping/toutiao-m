// axios 请求模块
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'https://toutiao.itheima.net'
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // config：本次请求的配置对象
    // console.log(config)
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  function (error) {
    // 对请求错误做些什么(请求还没有发出去) 会进入这里
    return Promise.reject(error)
  }
)

// 响应拦截器
export default request
