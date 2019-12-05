import request from '@/utils/request'

export function getDeviceData(params) {
  return request({
    url: 'http://localhost:3000/data',
    method: 'post',
    data: params
  })
}

export function getStatistics() {
  return request({
    url: '/stats',
    method: 'get'
  })
}
