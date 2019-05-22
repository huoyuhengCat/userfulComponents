import Vue from 'vue'
import Vuex from 'vuex'
import cancelAxios from './base/cancelAxios'
import userInfo from './base/user'
import commonApi from './modules/commonApi'
import baseGetters from './base/getters'
import devGetters from './modules/getters'
import lodash from 'lodash'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    cancelAxios,
    userInfo,
    commonApi
  },
  getters: lodash.merge(baseGetters, devGetters)
})

export default store
