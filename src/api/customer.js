import request from '@/utils/request'

export function createCustomer(proId, data) {
  return request({
    url: '/product/' + proId + '/customer',
    method: 'post',
    data
  })
}
export function deleteCustomer(authorization, id) {
  return request({
    url: '/customer/' + id,
    method: 'delete',
    headers: { authorization }
  })
}
export function updateCustomer(authorization, id, data) {
  return request({
    url: '/customer/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
export function getCustomerList(proId, page, size) { // 得到org下面的customer
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

export function getAllCustomerList(authorization) { // 得到所有customer，仅限webadmin
  return request({
    url: '/customer',
    method: 'get',
    headers: { authorization }
  })
}

export function createCustomerStaff(authorization, data) {
  return request({
    url: '/user',
    method: 'post',
    headers: { authorization },
    data
  })
}
export function deleteCustomerStaff(authorization, id) {
  return request({
    url: '/user/' + id,
    method: 'delete',
    headers: { authorization }
  })
}
export function updateCustomerStaff(authorization, id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
export function getCustomerStaffList(authorization, customerId) {
  return request({
    url: '/customer/' + customerId + '/user',
    method: 'get',
    headers: { authorization }
  })
}

