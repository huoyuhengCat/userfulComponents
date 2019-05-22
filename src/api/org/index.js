import request from '@/utils/request'
export const ListOrgs = params => {
  return request({
    url: '/org/ListOrgs',
    method: 'post',
    data: params
  })
}
export const addOrg = params => {
  return request({
    url: '/org/addOrg',
    method: 'post',
    data: params
  })
}
export const all = params => {
  return request({
    url: '/org/all',
    method: 'get'
  })
}
export const authcEdit = params => {
  return request({
    url: '/org/authcEdit',
    method: 'post',
    data: params
  })
}
export const authcMenu = params => {
  return request({
    url: '/org/authcMenu',
    method: 'post',
    data: params
  })
}
export const editOrg = params => {
  return request({
    url: '/org/editOrg',
    method: 'post',
    data: params
  })
}
