import Cookies from 'js-cookie'

export function getToken(cookieKey) {
  return Cookies.get(cookieKey)
}

export function setToken(cookieKey, value) {
  return Cookies.set(cookieKey, value)
}

export function removeToken() {
  var len = arguments.length
  for (var i = 0; i < len; i++) {
    Cookies.remove(arguments[i])
  }
  return 0
}

export function getCookie(cookieKey) {
  return Cookies.get(cookieKey)
}

export function setCookie(cookieKey, value) {
  return Cookies.set(cookieKey, value)
}

export function removeCookie() {
  var len = arguments.length
  for (var i = 0; i < len; i++) {
    Cookies.remove(arguments[i])
  }
  return 0
}
