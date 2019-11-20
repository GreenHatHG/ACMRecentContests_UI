import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        component: () => import('@/pages/contest'),
        meta: {
          title: '最近比赛信息'
        }
      },
      {
        path: 'user/center',
        name: 'user_center',
        component: () => import('@/pages/user/center'),
        meta: {
          title: '个人中心',
          auth: true
        }
      },
      {
        path: 'user/remind',
        name: 'user_remind',
        component: () => import('@/pages/user/remind'),
        meta: {
          title: '赛事提醒',
          auth: true
        }
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register')
  },
  {
    path: '/resetpwd',
    name: 'resetpwd',
    component: () => import('@/pages/resetpwd')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
