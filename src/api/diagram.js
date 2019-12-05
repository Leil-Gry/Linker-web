import request from '@/utils/request'

export function getDiagramList(proId) {
  return request({
    url: '/product/' + proId + '/diagram',
    method: 'get'
  })
}

export function createDiagram(proId, data) {
  return request({
    url: '/product/' + proId + '/diagram',
    method: 'post',
    data
  })
}

export function deleteDiagram(proId, diaId) {
  return request({
    url: '/product/' + proId + '/diagram/' + diaId,
    method: 'delete'
  })
}
