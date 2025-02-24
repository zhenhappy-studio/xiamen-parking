import { un } from '@uni-helper/uni-network'

const instance = un.create({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  headers: {},
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    if (!/^\/login/.test(config.url!)) {
      const token = uni.getStorageSync('token')
      if (token)
        config.headers!.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response.data as any
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default instance
