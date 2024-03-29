import { loginByEmail, getMyInfoByAuthToken } from '@/api/login'
import { getStatistics } from '@/api/allData'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    id: '',
    email: '',
    nickname: '',
    gender: '',
    avatar: '',
    type: '',
    role: '',
    phone: '',
    fullname: '',
    createdBy: '',
    organizationId: '',
    customerId: '',
    orgCount: 0,
    customerCount: 0,
    product1Count: 0,
    product2Count: 0,
    product3Count: 0,
    device1Count: 0,
    device2Count: 0,
    device4Count: 0,
    token: '',
    roles: [],
    f: [],
    // currentRoles:'', 少了一个currentRoles 少了的意义不明
    currentRelatedId: ''
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
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
    SET_CREATEDNAME: (state, createdName) => {
      state.createdName = createdName
    },
    SET_ORGANIZATIONID: (state, organizationId) => {
      state.organizationId = organizationId
    },
    SET_ORGANIZATIONNAME: (state, organizationName) => {
      state.organizationName = organizationName
    },
    SET_CUSTOMERID: (state, customerId) => {
      state.customerId = customerId
    },
    SET_CUSTOMERNAME: (state, customerName) => {
      state.customerName = customerName
    },
    SET_ORGCOUNT: (state, orgCount) => {
      state.orgCount = orgCount
    },
    SET_CUSTOMERCOUNT: (state, customerCount) => {
      state.customerCount = customerCount
    },
    SET_PRODUCT1COUNT: (state, product1Count) => {
      state.product1Count = product1Count
    },
    SET_PRODUCT2COUNT: (state, product2Count) => {
      state.product2Count = product2Count
    },
    SET_PRODUCT3COUNT: (state, product3Count) => {
      state.product3Count = product3Count
    },
    SET_DEVICE1COUNT: (state, device1Count) => {
      state.device1Count = device1Count
    },
    SET_DEVICE2COUNT: (state, device2Count) => {
      state.device2Count = device2Count
    },
    SET_DEVICE4COUNT: (state, device4Count) => {
      state.device4Count = device4Count
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_GENDER: (state, gender) => {
      state.gender = gender
    },
    SET_DEFAULTROLES: (state, currentRoles) => {
      state.currentRoles = currentRoles
    },
    SET_CURRENTRELATEDID: (state, currentRelatedId) => {
      state.currentRelatedId = currentRelatedId
    }
  },

  actions: {
    // 用户名登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim()
      const password = userInfo.password
      const captcha = userInfo.captcha
      return new Promise((resolve, reject) => {
        loginByEmail(email, password, captcha).then(response => {
          if (response.status == 200) {
            setCookie('authToken', response.data.token)//  在这里设置token到Cookie，通过Cookie里的token查用户信息，存到state里
            commit('SET_TOKEN', response.data.token)
            resolve()
          } else { //  不知道为什么全局方法无效，单独引用了message
            Message.error({
              message: response
            })
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户权限等信息并保存在state
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMyInfoByAuthToken().then(response => {
          //  console.log("***********"+response.data.id)
          if (!response.data) {
            reject('获取用户信息错误')
          } else {
            var roles = []
            var currentRoles = []
            var currentRelatedId = ''
            const data = response.data
            for (let i = 0; i < data.roles.length; i++) {
              switch (true) {
                case data.roles[i].role == '1':
                  roles[i] = ['webAdmin']; break
                case data.roles[i].role == '21':
                  roles[i] = ['organizationAdmin']; break
                case data.roles[i].role == '31':
                  roles[i] = ['customerAdmin']; break
                case data.roles[i].role == '22':
                  roles[i] = ['organizationStaff']; break
                case data.roles[i].role == '32':
                  roles[i] = ['customerStaff']; break
              }
            }
            for (let i = 0; i < data.roles.length; i++) {
              roles[i].push(data.roles[i].identity)
            } // 权限在二维数组第一个，第二个是id
            if (getCookie('changedCurrentRoles')) {
              currentRelatedId = (getCookie('currentRelatedId'))
              currentRoles[0] = (getCookie('changedCurrentRoles'))// 多权限用户，选择过其他的权限则会在cookie暂存，如果暂存中没有，则用传过来的数组第一个
            } else { // 默认登录权限为第一个
              setCookie('changedCurrentRoles', roles[0][0])
              setCookie('currentRelatedId', roles[0][1])
              currentRoles = roles[0]
              currentRelatedId = roles[0][1]
            }

            // 拉取到信息后设置state
            commit('SET_ID', data.id)
            commit('SET_EMAIL', data.email)
            commit('SET_PHONE', data.phone)
            commit('SET_NICKNAME', data.nickname)
            commit('SET_FULLNAME', data.fullName)
            commit('SET_GENDER', data.gender)
            commit('SET_AVATAR', data.avatar)

            commit('SET_ORGANIZATIONID', data.organizationId)
            commit('SET_CUSTOMERID', data.customerId)
            commit('SET_ROLES', roles)

            commit('SET_DEFAULTROLES', currentRoles)
            commit('SET_CURRENTRELATEDID', currentRelatedId)

            // commit('SET_CREATEDBY', data.createdBy)
            // commit('SET_CREATEDNAME', data.createdName)
            // commit('SET_ORGANIZATIONNAME', data.organizationName)
            // commit('SET_CUSTOMERNAME', data.customerName)
            // commit('SET_ORGCOUNT', data.orgCount)
            // commit('SET_CUSTOMERCOUNT', data.customerCount)
            // commit('SET_PRODUCTCOUNT', data.productCount)
            // commit('SET_DEVICECOUNT', data.deviceCount)
            // commit('SET_TOKEN', getCookie('authToken'))
            // commit('SET_TYPE', data.type)// 0:Admin,1:Organization,2:customer
            // commit('SET_ROLE', data.role)// 0:Admin,1:user
            resolve(currentRoles)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetStatistics({ commit, state }) {
      return new Promise((resolve, reject) => {
        getStatistics().then(response => {
          if (!response.data) {
            reject('获取数据错误!')
          } else {
            commit('SET_CUSTOMERCOUNT', response.data.customer)
            commit('SET_DEVICE1COUNT', response.data.device[2].num)
            commit('SET_DEVICE2COUNT', response.data.device[1].num)
            commit('SET_DEVICE4COUNT', response.data.device[0].num)
            commit('SET_ORGCOUNT', response.data.organization)
            commit('SET_PRODUCT1COUNT', response.data.product[0].num)
            commit('SET_PRODUCT2COUNT', response.data.product[1].num)
            commit('SET_PRODUCT3COUNT', response.data.product[2].num)
            resolve()
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
        removeCookie('changedCurrentRoles')
        removeCookie('currentRelatedId')
        resolve()
      })
    }
  }
}

export default user
