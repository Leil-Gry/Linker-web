import request from '@/utils/request'

// export function createFile(filename,proId) {
//   return request({
//     url: '/file?filename=' + filename + '&productId=' + proId,
//     method: 'post'
//   })
// }

export function createFile(filename, size, type, proId) {
  return request({
    url: '/file?filename=' + filename + '&size=' + size + '&type=' + type + '&productId=' + proId,
    method: 'post'
  })
}
