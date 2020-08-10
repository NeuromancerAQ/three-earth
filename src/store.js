import Vue from 'vue'
import Vuex from 'vuex'
import worldMap from '../src/store/worldMap'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    worldMap: worldMap,
  }
})
