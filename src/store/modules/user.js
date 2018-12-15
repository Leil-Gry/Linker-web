import { loginByEmail, getUserInfoById } from '@/api/login'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    _id: '',
    email: '',
    type: '',
    role: '',
    phone: '',
    fullname: '',
    createdBy: '',
    organizationId: '',
    customerId: '',
    orgCount: '',
    customerCount: '',
    productCount: '',
    deviceCount: '',
    token: '',
    roles: []
  },

  mutations: {
    SET__ID: (state, _id) => {
      state._id = _id
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_FULLNAME: (state, fullname) => {
      state.fullname = fullname
    },
    SET_CREATEDBY: (state, createdBy) => {
      state.createdBy = createdBy
    },
    SET_ORGANIZATIONID: (state, organizationId) => {
      state.organizationId = organizationId
    },
    SET_CUSTOMERID: (state, customerId) => {
      state.customerId = customerId
    },
    SET_ORGCOUNT: (state, orgCount) => {
      state.orgCount = orgCount
    },
    SET_CUSTOMERCOUNT: (state, customerCount) => {
      state.customerCount = customerCount
    },
    SET_PRODUCTCOUNT: (state, productCount) => {
      state.productCount = productCount
    },
    SET_DEVICECOUNT: (state, deviceCount) => {
      state.deviceCount = deviceCount
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        loginByEmail(email, password).then(response => {
          if (response.data.status === 0) {
            // alert(response.data.msg)
            const data = response.data.data
            setCookie('authToken', data.token)// 在这里设置token到Cookie，通过Cookie里的token查用户信息，存到state里
            setCookie('_id', data._id)// 以后不保存id，现在是不能通过token查，所以暂时用id查
            resolve()
          } else { // 不知道为什么全局方法无效，单独引用了message
            Message.error({
              message: response.data.msg
            })
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户权限等信息并保存在state
    GetUserRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfoById(getCookie('authToken'), getCookie('_id')).then(response => { // 以后用login接口的token查，不在Cookie存ID
          if (!response.data) {
            reject('error')
          } else {
            let roles
            const data = response.data.data
            switch (true) {
              case data.role === '0' && data.type === '0' :
                roles = ['webAdmin']; break
              case data.role === '0' && data.type === '1' :
                roles = ['organizationAdmin']; break
              case data.role === '0' && data.type === '2' :
                roles = ['customerAdmin']; break
              case data.role === '1' && data.type === '1' :
                roles = ['organizationStaff']; break
              case data.role === '1' && data.type === '2' :
                roles = ['customerStaff']; break
            }
            if (data.orgCount === undefined) { // 现在的API不返回0，手动设置为0
              data.orgCount = 0
            }
            if (data.customerCount === undefined) {
              data.customerCount = 1
            }
            if (data.productCount === undefined) {
              data.productCount = 0
            }
            if (data.deviceCount === undefined) {
              data.deviceCount = 0
            }
            // 拉取到信息后设置state
            commit('SET_ROLES', roles)
            commit('SET_EMAIL', data.email)
            commit('SET_TYPE', data.type)// 0:Admin,1:Organization,2:customer
            commit('SET_ROLE', data.role)// 0:Admin,1:user
            commit('SET_PHONE', data.phone)
            commit('SET_FULLNAME', data.fullname)
            commit('SET_CREATEDBY', data.createdBy)
            commit('SET_ORGANIZATIONID', data.organizationId)
            commit('SET_CUSTOMERID', data.customerId)
            commit('SET_ORGCOUNT', data.orgCount)
            commit('SET_CUSTOMERCOUNT', data.customerCount)
            commit('SET_PRODUCTCOUNT', data.productCount)
            commit('SET_DEVICECOUNT', data.deviceCount)
            commit('SET_TOKEN', getCookie('authToken'))
            commit('SET__ID', data._id)
            resolve(roles)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeCookie('authToken')
        removeCookie('_id')
        resolve()
      })
    }
  }
}

export default user
