import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const customerList = []
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

var testData=[
      {
        id: '1',
        timestamp: '2018-01-01 10:22',
        organizationName: '茂宇星弛股份有限公司1',
        status:'draft',
        creater:'张一',
        countStaff:'1',
        countCustomer:'1',
        countProducts:'1',
    countDevices:'1',
  }, {
    id: '2',
    timestamp: '2018-01-01 10:23',
    status: 'draft',
    organizationName: '大张旗鼓集团',
    creater: '张二',
    countStaff: '2',
    countCustomer: '2',
    countProducts: '2',
    countDevices: '2',
  }
]

for (let i=0;i<testData.length;i++)
{
  List.push(testData[i])
}

var testCustomerData=[
  {
    id: '1',
    timestamp: '2018-01-01 10:22',
    organizationName: '顾客1',
    status:'draft',
    creater:'张一',
    countStaff:'1',
    countCustomer:'1',
    countProducts:'1',
    countDevices:'1',
  }, {
    id: '2',
    timestamp: '2018-01-01 10:23',
    status: 'draft',
    organizationName: '顾客2',
    creater: '张二',
    countStaff: '2',
    countCustomer: '2',
    countProducts: '2',
    countDevices: '2',
  }
]
for (let i=0;i<testData.length;i++)
{
  customerList.push(testCustomerData[i])
}

export default {
  getList: config => {
    const { importance, type, title,organizationName, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      if (organizationName && item.organizationName.indexOf(organizationName) < 0) return false
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

  getPv: () => ({
    pvData: [
      {
        organizationStaffName: '张一', adminFlag: 1
      },
      {
        organizationStaffName: '张二', adminFlag: 0
      },
      {
        organizationStaffName: '张三', adminFlag: 0
      },
      {
        organizationStaffName: '张四', adminFlag: 0
      }]
  }),
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    data: 'success'
  })
}
