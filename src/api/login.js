import request from '@/utils/request'

export function loginByEmail(email, password, captcha) {
  const data = {
    email,
    password,
    captcha
  }
  return request({
    url: '/auth/signin',
    method: 'post',
    data
  })
}

export function getMyInfoByAuthToken() {
  return request({
    url: '/auth/me',
    method: 'get'
  })
}
