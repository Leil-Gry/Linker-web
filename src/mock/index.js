import Mock from 'mockjs'
import loginAPI from './login'
// import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

import organizationAPI from './organizationsList'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/user\/Role\.*/, 'get', loginAPI.getUserRole)

// 文章相关
// Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
// Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
// Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)
// Mock.mock(/\/article\/getCustomerList/, 'post', articleAPI.getCustomerList)
// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// organizations
Mock.mock(/\/organizations\/list/, 'get', organizationAPI.getOrganizationList)
Mock.mock(/\/organizations\/update/, 'post', organizationAPI.updateOrganization)
Mock.mock(/\/organizations\/create/, 'post', organizationAPI.createOrganization)
Mock.mock(/\/organizations\/staffList/, 'get', organizationAPI.getStaffList)
Mock.mock(/\/organizations\/createStaff/, 'post', organizationAPI.createStaff)
Mock.mock(/\/organizations\/updateStaff/, 'post', organizationAPI.updateStaff)

// customers
Mock.mock(/\/customers\/list/, 'get', organizationAPI.getCustomerList)
Mock.mock(/\/customers\/update/, 'post', organizationAPI.updateCustomer)
Mock.mock(/\/customers\/create/, 'post', organizationAPI.createCustomer)
Mock.mock(/\/customers\/staffList/, 'get', organizationAPI.getStaffList)
Mock.mock(/\/customers\/createStaff/, 'post', organizationAPI.createStaff)
Mock.mock(/\/customers\/updateStaff/, 'post', organizationAPI.updateStaff)

// product
Mock.mock(/\/products\/list/, 'get', organizationAPI.getProductList)
Mock.mock(/\/products\/update/, 'post', organizationAPI.updateProduct)
Mock.mock(/\/products\/create/, 'post', organizationAPI.createProduct)

// device
Mock.mock(/\/devices\/list/, 'get', organizationAPI.getDeviceList)
Mock.mock(/\/devices\/update/, 'post', organizationAPI.updateDevice)
Mock.mock(/\/devices\/create/, 'post', organizationAPI.createDevice)

export default Mock
