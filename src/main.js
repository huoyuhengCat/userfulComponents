import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './permission'
import 'nprogress/nprogress.css'
import globalComponents from './components/global'
import lodash from 'lodash'
import * as filters from '@/filters/base'
import './styles/element-variables.scss'
Vue.prototype.lodash = lodash
const toAsync = (promise) => {
  return promise.then(res => [true, res]).catch(err => [false, err])
}
Vue.prototype.toAsync = toAsync
Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(globalComponents)
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
