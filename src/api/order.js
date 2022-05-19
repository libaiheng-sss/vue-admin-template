import request from '@/utils/request'

export function addOrderAndCustomer(data) {
  return request({
    url: '/order/addOrderAndCustomer',
    method: 'post',
    data: data
  })
}
