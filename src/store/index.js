import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 歌手信息
    singer: {},
  },
  mutations: {},
  getters: {
    singer(state) {
      return state.singer;
    },
  },
  actions: {},
  modules: {},
});
