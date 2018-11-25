import request from '@/utils/request'

export function getProductList(data){
  return request({
    url:'/products/list',
    method:'get',
    params:{data}
  })
}

export function createProduct(data) {
  return request({
    url: '/products/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/products/update',
    method: 'post',
    data
  })
}
