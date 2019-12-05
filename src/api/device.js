import request from '@/utils/request'

export function getDeviceList(proId, cusId) {
  return request({
    url: '/product/' + proId + '/device/?customerId=' + cusId,
    method: 'get'
  })
}

export function createDevice(proId, data) {
  return request({
    url: '/product/' + proId + '/device',
    method: 'post',
    data
  })
}

export function updateDevice(proId, devId, data) {
  return request({
    url: '/product/' + proId + '/device/' + devId,
    method: 'put',
    data
  })
}

export function getDeviceDetail(proId, devId) {
  return request({
    url: '/product/' + proId + '/device/' + devId,
    method: 'get'
  })
}
