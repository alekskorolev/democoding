import { createStore } from 'vuex';
import auth from './auth';
import profile from './profile';

export default createStore({
  state: {
    test: 0,
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    profile,
  },
});
