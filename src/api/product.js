import request from '@/utils/request'

export function createProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}
export function deleteProduct(id) {
  return request({
    url: '/product/' + id,
    method: 'delete'
  })
}
export function updateProduct(id, data) {
  return request({
    url: '/product/' + id,
    method: 'put',
    data
  })
}
export function getProductListByOrg(orgId, page, size, status) { // 得到org下面的product
  if (status) {
    return request({
      url: '/product?organizationId=' + orgId + '&&page=' + page + '&&size=' + size + '&&status=' + status,
      method: 'get'
    })
  } else if (page && size) {
    return request({
      url: '/product?organizationId=' + orgId + '&&page=' + page + '&&size=' + size,
      method: 'get'
    })
  } else {
    return request({
      url: '/product?organizationId=' + orgId + '&&page=1&&size=10',
      method: 'get'
    })
  }
}

// export function getProductListByCus(authorization, cusId) { // 得到cus下面的product
//   return request({
//     url: '/customer/' + cusId + '/product',
//     method: 'get',
//     headers: { authorization }
//   })
// }

export function getProductDetail(id) { // 得到所有product，仅限webadmin
  return request({
    url: '/product/' + id,
    method: 'get'
  })
}
