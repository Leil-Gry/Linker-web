import request from '@/utils/request'

// export function createDiagramUsages(proId,data) {
//   return request({
//     url: '/product/' + proId + '/diagramusage' ,
//     method: 'post',
//     data
//   })
// }

export function createDiagramUsages(proId, diaId, type, cusId, tagValue) {
  if (cusId == '' && tagValue == '') {
    return request({
      url: '/product/' + proId + '/diagramusage?diagramId=' + diaId + '&type=' + type,
      method: 'post'
    })
  } else if (cusId != '' && tagValue != '') {
    return request({
      url: '/product/' + proId + '/diagramusage?diagramId=' + diaId + '&type=' + type + '&customer=' + cusId + '&tagValue=' + tagValue,
      method: 'post'
    })
  } else if (cusId != '') {
    return request({
      url: '/product/' + proId + '/diagramusage?diagramId=' + diaId + '&type=' + type + '&customer=' + cusId,
      method: 'post'
    })
  } else {
    return request({
      url: '/product/' + proId + '/diagramusage?diagramId=' + diaId + '&type=' + type + '&tagValue=' + tagValue,
      method: 'post'
    })
  }
}

export function findDiagramUsagesByProId(proId, type) {
  return request({
    url: '/product/' + proId + '/diagramusage?type=' + type,
    method: 'get'
  })
}

export function findDiagramUsagesBycusId(proId, type, cusId) {
  return request({
    url: '/product/' + proId + '/diagramusage?type=' + type + '&customerId=' + cusId,
    method: 'get'
  })
}

export function findDiagramUsagesBykeyValue(proId, type, tagKey, tagValue) {
  if (tagValue == '') {
    return request({
      url: '/product/' + proId + '/diagramusage?type=' + type + '&tagkey=' + tagKey,
      method: 'get'
    })
  } else {
    return request({
      url: '/product/' + proId + '/diagramusage?type=' + type + '&' + tagKey + ':' + tagValue,
      method: 'get'
    })
  }
}
