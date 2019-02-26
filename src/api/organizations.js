import request from '@/utils/request'

export function createOrganization(data) {
  return request({
    url: '/organization',
    method: 'post',
    data
  })
}
export function deleteOrganization(id) {
  return request({
    url: '/organization/' + id,
    method: 'delete'
  })
}
export function updateOrganization(id, data) {
  return request({
    url: '/organization/' + id,
    method: 'put',
    data
  })
}
export function getOrganizationList(page, size, name) {
  if (name) {
    return request({
      url: '/organization?page=' + page + '&&size=' + size + '&&name=' + name,
      method: 'get'
    })
  } else if (page && size) {
    return request({
      url: '/organization?page=' + page + '&&size=' + size,
      method: 'get'
    })
  } else { // 啥都没有
    return request({
      url: '/organization?page=1&&size=10', // 默认size是10
      method: 'get'
    })
  }
}

export function createOrgStaff(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function deleteOrgStaff(id, data) {
  return request({
    url: '/user/' + id,
    method: 'delete',
    data
  })
}
export function updateOrgStaff(id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data
  })
}
export function getOrgStaffList(orgId) {
  return request({
    url: '/user?organizationId=' + orgId,
    method: 'get'
  })
}

export function getOrganizationDetail(orgId) {
  return request({
    url: '/organization/' + orgId,
    method: 'get'
  })
}

