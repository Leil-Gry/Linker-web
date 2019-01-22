import request from '@/utils/request'

export function getAllUsersList() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function deleteUser(authorization, id) {
  return request({
    url: '/user/' + id,
    method: 'delete',
    headers: { authorization }
  })
}

export function updateUser(authorization, id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    headers: { authorization },
    data
  })
}
