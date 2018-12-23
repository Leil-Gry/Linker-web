import request from '@/utils/request'

export function createProduct(authorization, data) {
  return request({
    url: '/product',
    method: 'post',
    headers: { authorization },
    data
  })
}
export function deleteProduct(authorization, id) {
  return request({
    url: '/product/' + id,
    method: 'delete',
    headers: { authorization }
  })
}
export function updateProduct(authorization, id, data) {
  return request({
    url: '/product/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
export function getProductListByOrg(authorization, orgId) { // 得到org下面的product
  return request({
    url: '/organization/' + orgId + '/product',
    method: 'get',
    headers: { authorization }
  })
}

export function getProductListByCus(authorization, cusId) { // 得到cus下面的product
  return request({
    url: '/customer/' + cusId + '/product',
    method: 'get',
    headers: { authorization }
  })
}

export function getAllProductList(authorization) { // 得到所有product，仅限webadmin
  return request({
    url: '/product',
    method: 'get',
    headers: { authorization }
  })
}

