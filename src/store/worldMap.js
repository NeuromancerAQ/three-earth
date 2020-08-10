/**
 * Created by John on 05/06/2019.
 */
// import { MapActionTypes } from './actionTypes'
import { MapMutationTypes } from './mutationTypes'

export default {
  state: {
    mapData: {
    }
  },
  getters: {
    // getMapData: (state) => {
    //   return state.mapData.data
    // },
  },
  actions: {
    testtest({commit,state },payload){
      return new Promise((resolve)=>{
        commit(MapMutationTypes.GET_DATA_SUCCESS,payload)
        resolve(state.mapData)
      })
    }
  },
  mutations: {
    // MapMutationTypes.GET_DATA_SUCCESS
    [MapMutationTypes.GET_DATA_SUCCESS] (state, payload) {
      state.mapData = payload
    },
  },
}
