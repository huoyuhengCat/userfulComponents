import request from '@/utils/request'
export const addRole = params => {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}
export const authcEdit = params => {
  return request({
    url: '/role/authcEdit',
    method: 'post',
    data: params
  })
}
export const authcMenu = params => {
  return request({
    url: '/role/authcMenu',
    method: 'post',
    data: params
  })
}
export const deleteRole = params => {
  return request({
    url: '/role/delete',
    method: 'post',
    data: params
  })
}
export const detail = params => {
  return request({
    url: '/role/detail',
    method: 'post',
    data: params
  })
}
export const editRole = params => {
  return request({
    url: '/role/edit',
    method: 'post',
    data: params
  })
}
export const groupList = params => {
  return request({
    url: '/role/groupList',
    method: 'post',
    data: params
  })
}
export const getList = params => {
  return request({
    url: '/role/list',
    method: 'post',
    data: params
  })
}
export const listAllRoles = params => {
  return request({
    url: '/role/listAllRoles',
    method: 'get'
  })
}
export const orgRoles = params => {
  return request({
    url: '/role/orgRoles',
    method: 'post',
    data: params
  })
}
