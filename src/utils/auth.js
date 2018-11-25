import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

export function getToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setToken(TokenKey,token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
	var len = arguments.length;
	for (var i = 0;i<len;i++)
	{
		Cookies.remove(arguments[i])
	}
	return 0;
}
