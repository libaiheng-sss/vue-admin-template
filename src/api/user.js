import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function userList() {
  return request({
    url: '/user/userList',
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/user/createUser',
    method: 'post',
    data: data
  })
}

export function updataUser(data) {
  return request({
    url: '/user/updataUser',
    method: 'post',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'delete',
    params: data
  })
}
