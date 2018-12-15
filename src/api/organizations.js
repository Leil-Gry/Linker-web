import request from '@/utils/request'

export function createOrganization(authorization, data) {
  return request({
    url: '/organization',
    method: 'post',
    headers: { authorization },
    data
  })
}
export function deleteOrganization(authorization, id) {
  return request({
    url: '/organization/' + id,
    method: 'delete',
    headers: { authorization }
  })
}
export function updateOrganization(authorization, id, data) {
  return request({
    url: '/organization/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
export function getOrganizationList(authorization) {
  return request({
    url: '/organization',
    method: 'get',
    headers: { authorization }
  })
}

export function createOrgStaff(authorization, data) {
  return request({
    url: '/user',
    method: 'post',
    headers: { authorization },
    data
  })
}
export function deleteOrgStaff(authorization, id) {
  return request({
    url: '/user/' + id,
    method: 'delete',
    headers: { authorization }
  })
}
export function updateOrgStaff(authorization, id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
export function getOrgStaffList(authorization, orgId) {
  return request({
    url: '/user', // 暂时这样测试，下面的接口还没写好
    // url: '/organization/'+ orgId + '/user',
    method: 'get',
    headers: { authorization }
  })
}

