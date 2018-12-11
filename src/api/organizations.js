import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/organizations/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function getStaffList(data) {
  return request({
    url: '/organizations/staffList',
    method: 'get',
    params: { data }
  })
}

export function createOrganization(data) {
  return request({
    url: '/organizations/create',
    method: 'post',
    data
  })
}

export function updateOrganization(data) {
  return request({
    url: '/organizations/update',
    method: 'post',
    data
  })
}

export function createStaff(data) {
  return request({
    url: '/organizations/createStaff',
    method: 'post',
    data
  })
}
export function updateStaff(data) {
  return request({
    url: '/organizations/updateStaff',
    method: 'post',
    data
  })
}
