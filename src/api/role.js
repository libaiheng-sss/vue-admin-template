import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/role/getRoleList',
    method: 'post'
  })
}

export function updateRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: data
  })
}

export function insertRole(data) {
  return request({
    url: '/role/insertRole',
    method: 'post',
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    data: data
  })
}

export function getPermissionList() {
  return request({
    url: '/role/getPermissionList',
    method: 'post'
  })
}
