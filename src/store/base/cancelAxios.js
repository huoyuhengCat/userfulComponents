// 切换页面停掉当前页面请求
const cancelAxios = {
  state: {
    cancelTokens: []
  },
  mutations: {
    PUSH_TOKEN: (state, cancelTokens) => {
      state.cancelTokens.push(cancelTokens)
    },
    DELETE_TOKEN: (state) => {
      state.cancelTokens.forEach((val, index) => {
        val.cancel('cancel')
        delete state.cancelTokens[index]
      })
    }
  },
  actions: {
    pushCancelToken: ({ commit }, cancelTokens) => {
      commit('PUSH_TOKEN', cancelTokens)
    },
    deleteCancelToken: ({ commit }) => {
      commit('DELETE_TOKEN')
    }
  }
}
export default cancelAxios
