import request from '@/utils/request'

export function getUserByEmail(authorization, email) {
  return request({
    url: '/email/' + email,
    method: 'get',
    headers: { authorization }
  })
}
