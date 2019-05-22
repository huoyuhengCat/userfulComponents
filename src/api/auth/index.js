import request from '@/utils/request'
export const login = params => {
  return request({
    url: '/login',
    method: 'post',
    params
  })
}
export const logout = params => {
  return request({
    url: '/logout',
    method: 'post'
  })
}
