import request from '@/utils/request'
export const addMenu = params => {
  return request({
    url: '/menu/add',
    method: 'post',
    data: params
  })
}
export const deleteMenu = params => {
  return request({
    url: '/menu/delete',
    method: 'post',
    data: params
  })
}
export const detail = params => {
  return request({
    url: '/menu/detail',
    method: 'post',
    data: params
  })
}
export const editMenu = params => {
  return request({
    url: '/menu/edit',
    method: 'post',
    data: params
  })
}
export const indexMenuList = params => {
  return request({
    url: '/menu/indexMenuList',
    method: 'get'
  })
}
export const list = params => {
  return request({
    url: '/menu/list',
    method: 'post',
    data: params
  })
}
export const listAllMenu = params => {
  return request({
    url: '/menu/listAllMenu',
    method: 'get'
  })
}
export const getMenus = params => {
  return request({
    url: '/menu/menus',
    method: 'post',
    data: params
  })
}
