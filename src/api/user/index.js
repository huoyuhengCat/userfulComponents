import request from '@/utils/request'
export const deleteUser = params => {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data: params
  })
}
export const editPassword = params => {
  return request({
    url: '/user/editPassword',
    method: 'post',
    data: params
  })
}
export const editUser = params => {
  return request({
    url: '/user/editUser',
    method: 'post',
    data: params
  })
}
export const getUserList = params => {
  return request({
    url: '/user/list',
    method: 'post',
    data: params
  })
}
export const listUsers = params => {
  return request({
    url: '/user/listUsers',
    method: 'post',
    data: params
  })
}
export const loginUser = params => {
  return request({
    url: '/user/loginUser',
    method: 'get'
  })
}
export const saveUser = params => {
  return request({
    url: '/user/saveUser',
    method: 'post',
    data: params
  })
}
export const userDetail = params => {
  return request({
    url: '/user/userDetail',
    method: 'post',
    data: params
  })
}
