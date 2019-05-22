import router from '@/router'
import store from '@/store'
import { getTokens, getMenuUrl } from '@/utils/auth'
import { getLocalKey } from '@/utils'
import NProgress from 'nprogress'
const whiteList = ['/login', '/home', '/404']

NProgress.configure({ showSpinner: false })
const checkPermission = (to) => {
  if (whiteList.indexOf(to.path) !== -1) {
    return true
  }
  const userMap = JSON.parse(getLocalKey('userMap'))
  let urlObject = getMenuUrl(userMap)
  // 判断路径是否存在
  if (urlObject.hasOwnProperty(to.path)) {
    return true
  } else {
    return false
  }
}
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (store.getters.cancelTokens.length !== 0) {
    // 终止上个页面的所有请求
    store.dispatch('deleteCancelToken')
  }
  if (getTokens()) {
    if (!JSON.parse(getLocalKey('userMap'))) {
      // 等待拉用户接口
      await store.dispatch('updateMap')
    }
    if (to.path === '/login') {
      // 有token时，在登陆页面时直接进去默认首页
      next('/group_manage')
    } else {
      if (checkPermission(to)) {
        next()
      } else {
        // replace直接替换路由无效页
        next({ path: '/404', replace: true })
      }
    }
    // 可判断权限 可添加动态路由
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done(true)
})
