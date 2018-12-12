import request from '@/utils/request'

export function loginByUsername(email, password) {
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

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getUser(authorization) {
  return request({
    url: '/user',
    method: 'get',
    headers: { authorization }
  })
}
