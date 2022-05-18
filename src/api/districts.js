import request from '@/utils/request'

export function province() {
  return request({
    url: '/districts/province',
    method: 'post'
  })
}

export function city(data) {
  return request({
    url: '/districts/city',
    method: 'post',
    data: data
  })
}

export function county(data) {
  return request({
    url: '/districts/county',
    method: 'post',
    data: data
  })
}
