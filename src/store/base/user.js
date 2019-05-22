import { setTokens, getTokens, deleteTokens } from '@/utils/auth'
import { login, logout } from '@/api/auth'
import { indexMenuList } from '@/api/menu'
import { setLocalKey, getLocalKey } from '@/utils'
import router from '@/router'
const user = {
  state: {
    userName: getLocalKey('userName'),
    userAuth: getTokens(),
    userMap: JSON.parse(getLocalKey('userMap'))
  },
  mutations: {
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_USERAUTH: (state, userAuth) => {
      state.userAuth = userAuth
    },
    SET_USERMAP: (state, userMap) => {
      state.userMap = userMap
    }
  },
  actions: {
    logIn: ({ commit }, loginParams) => {
      // 登入
      return new Promise((reslove, reject) => {
        login(loginParams).then((res) => {
          commit('SET_USERNAME', res.userName)
          const token = `Bearer ${res.authorization}`
          commit('SET_USERAUTH', token)
          setTokens(token)
          setLocalKey('userName', res.userName)
          router.push('/group_manage')
          reslove()
        }).catch(error => reject(error))
      })
    },
    logOut: () => {
      // 登出
      return new Promise((reslove, reject) => {
        logout().then(() => {
          deleteTokens()
          router.push('/login')
          reslove()
        }).catch(error => reject(error))
      })
    },
    updateMap ({ commit }) {
      // 获取，更新路由
      return new Promise((reslove, reject) => {
        indexMenuList().then(res => {
          const menuList = res
          commit('SET_USERMAP', menuList)
          setLocalKey('userMap', JSON.stringify(menuList))
          console.log('更新了', menuList)
          reslove()
        }).catch(err => reject(err))
      })
    }
  }
}
export default user
