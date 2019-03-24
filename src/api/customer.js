import request from '@/utils/request'

export function createCustomer(proId, data) {
  return request({
    url: '/product/' + proId + '/customer',
    method: 'post',
    data
  })
}
export function deleteCustomer(proId, cusId) {
  return request({
    url: '/product/'+ proId + '/customer/' + cusId,
    method: 'delete'
  })
}
export function updateCustomer(id, data) {
  return request({
    url: '/customer/' + id,
    method: 'put',
    data
  })
}
export function getCustomerDetail(id) {
  return request({
    url: '/customer/' + id,
    method: 'get'
  })
}
export function getCustomerList(proId, page, size) { // 得到product下面的customer
  if (page && size) {
    return request({
      url: '/customer?productId=' + proId + '&&page=' + page + '&&size=' + size,
      method: 'get'
    })
  } else {
    return request({
      url: '/customer?productId=' + proId + '&&page=1&&size=10',
      method: 'get'
    })
  }
}

// export function getAllCustomerList(authorization) { // 得到所有customer，仅限webadmin
//   return request({
//     url: '/customer',
//     method: 'get',
//     headers: { authorization }
//   })
// }

export function createCustomerStaff(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function deleteCustomerStaff(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
export function updateCustomerStaff(id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data
  })
}
export function getCustomerStaffList(customerId) {
  return request({
    url: '/user?customerId=' + customerId,
    method: 'get'
  })
}

