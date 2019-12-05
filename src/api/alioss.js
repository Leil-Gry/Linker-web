import request from '@/utils/request'

export function getAliOss(proId) {
  return request({
    url: '/file/credential?productId=' + proId + '&type=write',
    method: 'get'
  })
}
