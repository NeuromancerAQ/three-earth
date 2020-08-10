import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io';
Vue.config.productionTip = false;

Vue.use(new VueSocketio({
  // debug: true,
  connection: 'http://localhost:3100',
}));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
