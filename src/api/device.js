import request from '@/utils/request'

export function getDeviceList(data){
  return request({
    url:'/devices/list',
    method:'get',
    params:{data}
  })
}

export function createDevice(data) {
  return request({
    url: '/devices/create',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/devices/update',
    method: 'post',
    data
  })
}
