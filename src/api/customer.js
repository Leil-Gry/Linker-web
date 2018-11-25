import request from '@/utils/request'

export function getCustomerList(data){
  return request({
    url:'/customers/list',
    method:'get',
    params:{data}
  })
}

export function getStaffList(data){
  return request({
    url:'/customers/staffList',
    method:'get',
    params:{data}
  })
}

export function createCustomer(data) {
  return request({
    url: '/customers/create',
    method: 'post',
    data
  })
}

export function updateCustomer(data) {
  return request({
    url: '/customers/update',
    method: 'post',
    data
  })
}

export function createStaff(data) {
  return request({
    url: '/customers/createStaff',
    method: 'post',
    data
  })
}
export function updateStaff(data) {
  return request({
    url: '/customers/updateStaff',
    method: 'post',
    data
  })
}
