import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/team/getUserList',
    method: 'post'
  })
}

export function getTeamList(data) {
  return request({
    url: '/team/getTeamList',
    method: 'post',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/team/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/team/update',
    method: 'post',
    data: data
  })
}
