import request from '@/utils/request'

export function personal(data) {
  return request({
    url: '/customer/personal',
    method: 'post',
    data: data
  })
}

export function team(data) {
  return request({
    url: '/customer/team',
    method: 'post',
    data: data
  })
}

export function all(data) {
  return request({
    url: '/customer/all',
    method: 'post',
    data: data
  })
}

export function addCustomer(data) {
  return request({
    url: '/customer/addCustomer',
    method: 'post',
    data: data
  })
}

export function getTeamUser() {
  return request({
    url: '/customer/getTeamUser',
    method: 'post'
  })
}

export function getTeamList() {
  return request({
    url: '/customer/getTeamList',
    method: 'post'
  })
}
