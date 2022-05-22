import request from '@/utils/request'

export function addOrderAndCustomer(data) {
  return request({
    url: '/order/addOrderAndCustomer',
    method: 'post',
    data: data
  })
}

export function addOrder(data) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data: data
  })
}

export function personal(data) {
  return request({
    url: '/order/personal',
    method: 'post',
    data: data
  })
}
