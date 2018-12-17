import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: '首页', noCache: true }
      }
    ]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/icon',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: {
          title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['admin']
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  {
    path: '/organizations',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['webAdmin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/organizations/index'),
        name: 'organizations',
        meta: { title: 'organizations', icon: '组织' }
      }
    ]
  },
  {
    path: '/allUsers',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['webAdmin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/allUsers/index'),
        name: 'allUsers',
        meta: { title: 'allUsers', icon: 'people' }
      }
    ]
  },
  {
    path: '/customers',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['webAdmin', 'organizationAdmin', 'customerAdmin', 'organizationStaff', 'customerStaff'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/customers/index'),
        name: 'customers',
        meta: { title: 'customers', icon: '客户' }
      }
    ]
  },
  {
    path: '/products',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['webAdmin', 'organizationAdmin', 'customerAdmin', 'organizationStaff', 'customerStaff'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/products/index'),
        name: 'products',
        meta: { title: 'products', icon: '产品' }
      }
    ]
  },
  {
    path: '/devices',
    component: Layout,
    redirect: 'noredirect',
    meta: { roles: ['webAdmin', 'organizationAdmin', 'customerAdmin', 'organizationStaff', 'customerStaff'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/devices/index'),
        name: 'devices',
        meta: { title: 'devices', icon: '设备' }
      }
    ]
  },
  {
    path: '/deviceDetail',
    component: Layout,
    meta: { roles: ['webAdmin', 'organizationAdmin', 'customerAdmin', 'organizationStaff', 'customerStaff'] },
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/deviceDetail/index'),
        name: 'deviceDetail',
        hidden: true,
        meta: { title: 'deviceDetail', icon: '设备' }
      }
    ]
  },
  { path: '*', redirect: '/401', hidden: true }
]
