const baseRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/Home',
    name: '首页',
    component: () => import('../views/Layout/index'),
    children: [
      {
        path: '/home',
        name: '首页',
        component: () => import('../views/Home/index')
      }
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    component: () => import('../views/Layout/index'),
    children: [
      {
        path: '/group_manage',
        name: '组织管理',
        component: () => import('../views/System/group_manage')
      },
      {
        path: '/menu_manage',
        name: '菜单管理',
        component: () => import('../views/System/menu_manage')
      }
    ]
  },
  {
    path: '/root',
    name: '权限管理',
    component: () => import('../views/Layout/index'),
    children: [
      {
        path: '/root_manage',
        name: '角色(基础权限)',
        component: () => import('../views/Root/root_manage')
      }
    ]
  },
  {
    path: '/user',
    name: '用户管理',
    component: () => import('../views/Layout/index'),
    children: [
      {
        path: '/user_list',
        name: '用户',
        component: () => import('../views/User/user_list')
      },
      {
        path: '/user_listAll',
        name: '用户总览',
        component: () => import('../views/User/user_listAll')
      }
    ]
  },
  {
    path: '/404',
    name: 'error404',
    component: () => import('../views/Error/404')
  }
]
export default baseRouterMap
