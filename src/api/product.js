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
export function getProductListByCus(cusId, page, size, status) { // 得到cus下面的product
  if (status) {
    return request({
      url: '/customer/' + cusId + '/product?page=' + page + '&&size=' + size + '&&status=' + status,
      method: 'get'
    })
  } else if (page && size) {
    return request({
      url: '/customer/' + cusId + '/product?page=' + page + '&&size=' + size,
      method: 'get'
    })
  } else {
    return request({
      url: '/customer/' + cusId + '/product?page=1&&size=10',
      method: 'get'
    })
  }
}
export function getProductDetail(proId) { // 得到所有product，仅限webadmin
  return request({
    url: '/product/' + proId,
    method: 'get'
  })
}

export function getMappingList(proId) {
  return request({
    url: '/product/' + proId + '/mapping',
    method: 'get'
  })
}

export function createMapping(proId, data) {
  return request({
    url: '/product/' + proId + '/mapping',
    method: 'post',
    data
  })
}

export function getAllTagKeys(proId) {
  return request({
    url: '/product/' + proId + '/tags',
    method: 'get'
  })
}

export function getAllTagValues(proId, tagkey) {
  return request({
    url: '/product/' + proId + '/tag/' + tagkey + '/values',
    method: 'get'
  })
}

