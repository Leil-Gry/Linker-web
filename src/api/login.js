import request from '@/utils/request'

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUserInfoById(authorization, _id) {
  return request({
    url: '/user/' + _id,
    method: 'get',
    headers: { authorization }
  })
}

export function getUser(authorization, id) {
  return request({
    url: '/user/' + id,
    method: 'get',
    headers: { authorization }
  })
}
