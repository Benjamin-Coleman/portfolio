import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router'
import { routes } from './router-config'

Vue.use(Router)

const router = new Router({
  routes: routes,
  mode: 'history',
})

const app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
