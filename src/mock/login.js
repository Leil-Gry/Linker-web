// import { param2Obj } from '@/utils'

// // const
// //   admin= {
// //     roles: ['admin'],
// //     token: 'admin',
// //     introduction: '我是超级管理员',
// //     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
// //     name: 'Super Admin'
// //   }
//   // editor: {
//   //   roles: ['editor'],
//   //   token: 'editor',
//   //   introduction: '我是编辑',
//   //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//   //   name: 'Normal Editor'
//   // },
//   // webAdmin: {
//   //   roles: ['webAdmin'],
//   //   token: 'webAdmin',
//   //   introduction: '我是webAdmin',
//   //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//   //   name: 'webAdmin',
//   //   countOrganization: '666'
//   // },
//   // organizationAdmin: {
//   //   roles: ['organizationAdmin'],
//   //   token: 'organizationAdmin',
//   //   introduction: '我是organizationAdmin',
//   //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//   //   name: 'organizationAdmin',
//   //   myOwnOrganization: '123org'
//   // },
//   // customerAdmin: {
//   //   roles: ['customerAdmin'],
//   //   token: 'customerAdmin',
//   //   introduction: '我是customerAdmin',
//   //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//   //   name: 'customerAdmin',
//   //   myOwnCustomer: 'starcustomer'
//   // }
//   // webAdmin = {
//   //   email: 123,
//   //   type: 0,
//   //   roles: 0,
//   //   token: 'admin',
//   // }

// export default {
//   loginByUsername: config => {
//     const { username } = JSON.parse(config.body)
//     return userMap[username]
//   },
//   getUserInfo: config => {
//     const { token } = param2Obj(config.url)
//     if (userMap[token]) {
//       return userMap[token]
//     } else {
//       return false
//     }
//   },
//   getUserRole: config => {
//     const { username, password } = param2Obj(config.url)
//     if (userMap[ username , passwor]) {
//       return userMap[username]
//     }
//     else {
//       return false
//     }
//   },
//   logout: () => 'success'
// }
