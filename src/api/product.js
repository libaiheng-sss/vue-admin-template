import request from '@/utils/request'

export function addProduct(data) {
  return request({
    url: '/product/add',
    method: 'post',
    data: data
  })
}

export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'delete',
    data: data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/product/delete',
    method: 'delete',
    data: data
  })
}

export function getList(data) {
  return request({
    url: '/product/getList',
    method: 'post',
    data: data
  })
}

export function getChildrenList(data) {
  return request({
    url: '/product/getChildrenList',
    method: 'post',
    data: data
  })
}
export function getOrderProductList() {
  return request({
    url: '/product/getOrderProductList',
    method: 'post'
  })
}

export function getProductAmountTotal(data) {
  return request({
    url: '/product/getProductAmountTotal',
    method: 'post',
    data: data
  })
}
