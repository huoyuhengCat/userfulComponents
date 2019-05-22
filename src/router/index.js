import Vue from 'vue'
import Router from 'vue-router'
import asyncRoute from './asyncRoute'
import baseRoute from './baseRoute'
Vue.use(Router)
const allRoutes = baseRoute.concat(asyncRoute)
export default new Router({
  routes: allRoutes
})
