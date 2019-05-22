import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { logout } from '@/api/auth'
import { getTokens, deleteTokens } from '@/utils/auth'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 500000, // request timeout,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (getTokens()) {
      config.headers['Authorization'] = getTokens()
    }
    config.cancelToken = new axios.CancelToken(cancel => {
      store.dispatch('pushCancelToken', { cancel })
    })
    return config
  },
  error => {
    Message.error('请求失败信息：' + error)
    return Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  async response => {
    const res = response.data
    if (res.code == '0000') {
      return res.data
    } else if (parseInt(res.code) == '1100') {
      logout().then(() => {
        deleteTokens()
        router.push('/login')
      }).catch()
      Message.error(res.msg)// 尚未登陆 token过期
      return Promise.reject(res.msg)
    } else {
      Message.error(res.msg)
      return Promise.reject(res.msg)
    }
  },
  error => {
    if (error.message === 'cancel') {
      try {
        // 抛出取消请求错误
      } catch (error) {
        //
      }
    } else {
      // Message.error('请求失败信息：' + error)
      return Promise.reject(error)
    }
  }
)

export default service
