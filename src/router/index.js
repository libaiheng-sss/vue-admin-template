import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
  // 404 page must be placed at the end !!!

]

export const asyncRoutes = [
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/personal',
    name: '客户',
    meta: {
      roles: ['admin', 'customerPersonal', 'customerTeam', 'customerAll'],
      title: '客户',
      icon: 'el-icon-s-help' },
    children: [
      {
        path: 'personal_customer',
        name: '个人客户',
        component: () => import('@/views/customer/personal_customer'),
        meta: { title: '个人客户', icon: 'table', roles: ['admin', 'customerPersonal'] }
      },
      {
        path: 'team_customer',
        name: '团队客户',
        component: () => import('@/views/customer/team_customer'),
        meta: { title: '团队客户', icon: 'table', roles: ['admin', 'customerTeam'] }
      },
      {
        path: 'all_customer',
        name: '所有客户',
        component: () => import('@/views/customer/all_customer'),
        meta: { title: '所有客户', icon: 'table', roles: ['admin', 'customerAll'] }
      }
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/personal_online',
    name: '线上订单',
    meta: { roles: ['admin', 'orderPersonal', 'orderTeam', 'orderAll', 'orderAddOrderAndCustomer'], title: '线上订单', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'personal_online',
        name: '个人线上订单',
        component: () => import('@/views/agent/personal_online'),
        meta: { title: '个人线上订单', icon: 'table', roles: ['admin', 'orderPersonal'] }
      },
      {
        path: 'team_online',
        name: '团队线上订单',
        component: () => import('@/views/agent/team_online'),
        meta: { title: '团队线上订单', icon: 'table', roles: ['admin', 'orderTeam'] }
      },
      {
        path: 'all_online',
        name: '线上所有订单',
        component: () => import('@/views/agent/all_online'),
        meta: { title: '线上所有订单', icon: 'table', roles: ['admin', 'orderAll'] }
      },
      {
        path: 'add_online',
        name: '添加线上订单',
        component: () => import('@/views/agent/add_online'),
        meta: { title: '添加线上订单', icon: 'table', roles: ['admin', 'orderAddOrderAndCustomer'] }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/productList',
    name: '产品',
    meta: { title: '产品', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'productList',
        name: '产品列表',
        component: () => import('@/views/product/productList'),
        meta: { title: '产品列表', icon: 'table', roles: ['admin', 'customerPersonal'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: '用户',
    meta: { title: '用户', icon: 'el-icon-s-help', roles: ['admin', 'userUserList', 'userRule'] },
    children: [
      {
        path: 'userList',
        name: '用户列表',
        component: () => import('@/views/user/user_list'),
        meta: { title: '用户列表', icon: 'table', roles: ['admin', 'userUserList'] }
      },
      {
        path: 'teamList',
        name: '团队列表',
        component: () => import('@/views/user/team_list'),
        meta: { title: '团队列表', icon: 'table', roles: ['admin', 'teamList'] }
      },
      {
        path: '/roles',
        name: '权限列表',
        component: () => import('@/views/user/roles_list'),
        meta: { title: '权限列表', icon: 'tree', roles: ['admin', 'userRule'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// router.selfaddRoutes = function(params) {
//   debugger
//   router.matcher = new Router().matcher
//   router.addRoutes(constantRoutes)
//   router.addRoutes(params)
// }

export default router
