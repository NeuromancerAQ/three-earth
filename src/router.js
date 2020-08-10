import Vue from 'vue'
import Router from 'vue-router'

import ThreeEarth from './views/threeEarth'
import test from './views/test'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ThreeEarth',
      component: ThreeEarth,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        keepAlive: false
      }
    }
  ]
})
