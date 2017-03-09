import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router'
import { routes } from './router-config'

import AnimationStore from './stores/AnimationStore.js'

Vue.use(Router)

const router = new Router({
  routes: routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  AnimationStore.setRouterInfo(from.name, to.name)
  next()
})

const app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
