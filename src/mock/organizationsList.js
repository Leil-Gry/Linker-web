import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const organizationsList = []
const customersList = []
const count = 7

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({
//     id: '@increment',
//     timestamp: +Mock.Random.date('T'),
//     author: '@first',
//     reviewer: '@first',
//     title: '@title(2, 4)',
//     content_short: '我是测试数据',
//     content: baseContent,
//     forecast: '@float(0, 100, 2, 2)',
//     // importance: '@integer(1, 3)',
//     // 'type|1': ['CN', 'US', 'JP', 'EU'],
//     'status|1': ['published', 'draft', 'deleted'],
//     display_time: '@datetime',
//     comment_disabled: true,
//     pageviews: '@integer(300, 5000)',
//     countStaff:'@integer(1,10)',
//     countCustomer:'@integer(1,10)',
//     countProducts:'@integer(1,10)',
//     countDevices:'@integer(1,10)',
//     image_uri,
//     platforms: ['a-platform']
//   }))
// }

var organizationsData=[
  {
    id: +Mock.Random.integer(1,200),
    name: '茂宇星弛股份有限公司1',
    description:'描述1',
    address:'地址1',
    contact:'联系人一',
    phone:'12344444',
    status:'draft',
    createdBy:'张一',
    createAt: +Mock.Random.date('T'),
    countStaff:'1',
    countCustomer:'1',
    countProducts:'1',
    countDevices:'1',
  }, {
    id: +Mock.Random.integer(1,200),
    name: '22222222222',
    description:'描述2',
    address:'地址2',
    contact:'联系人er',
    phone:'123443343345345444',
    status:'draft',
    createdBy:'张二',
    createAt: +Mock.Random.date('T'),
    countStaff:'333',
    countCustomer:'23',
    countProducts:'2323',
    countDevices:'3223',
  }
]

for (let i=0;i<organizationsData.length;i++)
{
  organizationsList.push(organizationsData[i])
}

var customersData=[
  {
    id: +Mock.Random.integer(1,200),
    name: 'customer1111',
    description:'描述1',
    status:'draft',
    organization:'1所属的组织！！',
    organizationId:+Mock.Random.integer(1,200),
    createdBy:'张二',
    createAt: +Mock.Random.date('T'),
    countStaff:'333',
    countProducts:'2323',
    countDevices:'3223',
  }, {
    id: +Mock.Random.integer(1,200),
    name: 'customer222222',
    description:'描述2',
    status:'draft',
    organization:'22222222所属的组织！！',
    organizationId:+Mock.Random.integer(1,200),
    createdBy:'333333',
    createAt: +Mock.Random.date('T'),
    countStaff:'23452',
    countProducts:'223',
    countDevices:'322123',
  }
]
for (let i=0;i<customersData.length;i++)
{
  customersList.push(customersData[i])
}



var staffData=[
  {
    id: +Mock.Random.integer(1,200),
    email: 'testStaff1@star.com',
    password:'************',
    fullname:'fullname1',
    status:'isAdmin',
    phone:'12344444',
    createdBy:'张一',
    createAt: +Mock.Random.date('T')
  }, {
    id: +Mock.Random.integer(1,200),
    email: 'testStaff2@star.com',
    password:'************',
    fullname:'fullname2',
    status:'notAdmin',
    phone:'222222222222',
    createdBy:'张二',
    createAt: +Mock.Random.date('T')
  }
]

const staffList = []
for (let i=0;i<staffData.length;i++)
{
  staffList.push(staffData[i])
}

var productData = [
  {
    id: +Mock.Random.integer(1,200),
    name: '产品1111',
    description:'描述111111',
    status:'draft',
    organization:'产品1111组织',
    organizationId:+Mock.Random.integer(1,200),
    customer:'产品11111所属的客户',
    customerId:+Mock.Random.integer(1,200),
    createdBy:'张二',
    createAt: +Mock.Random.date('T'),
    countDevices:'3223',
    productKey: '111111a1EB5WDPUh2',
    productSecret: '11111111crJvMzGdYGbAPBSP',
    tags: ['1tags1', '1tags2', '1tags3'],
    specification: [
      {
        identifier: 'level',
        name: '液位，物模型1-1',
        description: '物模型描述1-1',
        dataType: {
          type: 'int',
          specs: {
            min: 0,
            max: 100,
            unit: 'ml',
            unitName: '毫升'
          }
        }
      },
      {
        identifier: 'level222222',
        name: '液位，物模型1-2',
        description: '物模型描述1-2',
        dataType: {
          type: 'string',
          specs: {
            min: 10,
            max: 999,
            unit: 'mllll',
            unitName: '毫升1-22'
          }
        }
      }
    ]
  },
  {
    id: +Mock.Random.integer(1,200),
    name: '产品22222222222',
    description:'描述222222222222',
    status:'draft',
    organization:'产品1111组织',
    organizationId:+Mock.Random.integer(1,200),
    customer:'产品11111所属的客户',
    customerId:+Mock.Random.integer(1,200),
    createdBy:'张二',
    createAt: +Mock.Random.date('T'),
    countDevices:'3223',
    productKey: '222222222a1EB5WDPUh2',
    productSecret: '2222222crJvMzGdYGbAPBSP',
    tags: ['2tags1', '2tags2', '2tags3'],
    specification: [
      {
        identifier: 'leve2-1111',
        name: '液位，物模型2-1',
        description: '物模型描述2-1',
        dataType: {
          type: 'int',
          specs: {
            min: 0,
            max: 100,
            unit: 'ml',
            unitName: '毫升'
          }
        }
      },
      {
        identifier: 'level2-222222',
        name: '液位，物模型2-2',
        description: '物模型描述2-2',
        dataType: {
          type: 'string',
          specs: {
            min: 10,
            max: 999,
            unit: 'mllll',
            unitName: '毫升1-22'
          }
        }
      }
    ]
  }
]
const productList = []
for (let i=0;i<productData.length;i++)
{
  productList.push(productData[i])
}
var deviceData = [
  {
    id: +Mock.Random.integer(1,200),
    name: '设备1111',
    description:'描述112211111',
    status:'draft',
    organization:'设备1111组织',
    organizationId:+Mock.Random.integer(1,200),
    customer:'设备11111所属的客户',
    customerId:+Mock.Random.integer(1,200),
    product:'设备1所属的产品',
    productId:+Mock.Random.integer(1,200),
    createdBy:'张二',
    createAt: +Mock.Random.date('T'),
    deviceKey: '111111a1EB5WDPUh2',
    deviceSecret: '11111111crJvMzGdYGbAPBSP',
    activatedAt:'123234423235',
    mapping:'23434534345',
    tags:['1tags1','1tags2','1tags3'],
  },
  {
    id: +Mock.Random.integer(1,200),
    name: '设备2222222222222222221',
    description:'描述2222221',
    status:'draft',
    organization:'设备2222组织',
    organizationId:+Mock.Random.integer(1,200),
    customer:'设备2221所属的客户',
    customerId:+Mock.Random.integer(1,200),
    product:'设备2所属的产品',
    productId:+Mock.Random.integer(1,200),
    createdBy:'张234345',
    createAt: +Mock.Random.date('T'),
    deviceKey: '222211a1EB5WDPUh2',
    deviceSecret: '232221111crJvMzGdYGbAPBSP',
    activatedAt:'dfghfgh423235',
    mapping:'23456567dfgfgh45',
    tags:['2tags1','2tags2','2tags3'],
  }
]
const deviceList = []
for (let i=0;i<deviceData.length;i++)
{
  deviceList.push(deviceData[i])
}

var organizationOptionsData=[
  {
    value:'所属组织1value',
    label:'所属组织1label'
  },{
    value:'所属组织2value',
    label:'所属组织2label'
  },{
    value:'所属组织3value',
    label:'所属组织3label'
  }
]
const organizationOptions = []
for (let i=0;i<organizationOptionsData.length;i++)
{
  organizationOptions.push(organizationOptionsData[i])
}

var customerOptionsData=[
  {
    value:'客户1value',
    label:'111'
  },{
    value:'客户2value',
    label:'222'
  },{
    value:'客户3value',
    label:'333'
  }
]
const customerOptions = []
for (let i=0;i<customerOptionsData.length;i++)
{
  customerOptions.push(customerOptionsData[i])
}
var productOptionsData=[
  {
    value:'产品1value',
    label:'111'
  },{
    value:'产品2value',
    label:'222'
  },{
    value:'产品3value',
    label:'333'
  }
]
const productOptions = []
for (let i=0;i<productOptionsData.length;i++)
{
  productOptions.push(productOptionsData[i])
}


export default {
  getOrganizationList: config => {
    const { importance, type, title,name, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = organizationsList.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getStaffList: config => {
    return {
      title:'success message',
      message:'success message',
      type: 'success',
      total: staffData.length,
      items: staffList
    }
  },
  getCustomerList: config => {
    const { importance, type, title,name, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = customersList.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList,
      organizationOptions:organizationOptions
    }
  },
  getProductList : config => {
    const { name, page = 1, limit = 20,  } = param2Obj(config.url)

    let mockList = productList.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList,
      organizationOptions:organizationOptions,
      customerOptions:customerOptions
    }
},
  getDeviceList : config => {
    const { name, page = 1, limit = 20,  } = param2Obj(config.url)

    let mockList = deviceList.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList,
      organizationOptions:organizationOptions,
      customerOptions:customerOptions,
      productOptions:productOptions
    }
  },
  createOrganization: () => {
    return {
      title:'成功',
      message:'创建成功',
      type:'success'
    }
  },
  updateOrganization: () => {
    return {
      title:'成功',
      message:'修改成功',
      type:'success'
    }
  },
  createStaff:() => {
    return {
      title:'成功',
      message:'创建成功',
      type:'success'
    }
  },
  updateStaff:() => {
    return {
      title:'成功',
      message:'修改成功',
      type:'success'
    }
  },
  createCustomer: () => {
    return {
      title:'成功',
      message:'创建成功',
      type:'success'
    }
  },
  updateCustomer: () => {
    return {
      title:'成功',
      message:'修改成功',
      type:'success'
    }
  },
  updateProduct: () => {
    return {
      title:'成功',
      message:'修改成功',
      type:'success'
    }
  },
  createProduct: () => {
    return {
      title:'成功',
      message:'创建成功',
      type:'success'
    }
  },
  updateDevice: () => {
    return {
      title:'成功',
      message:'修改成功',
      type:'success'
    }
  },
  createDevice: () => {
    return {
      title:'成功',
      message:'创建成功',
      type:'success'
    }
  },
}
