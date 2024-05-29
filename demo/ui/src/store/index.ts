import auth from '@/store/auth';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface State {};

export const key: InjectionKey<Store<State>> = Symbol('rootState');

export default createStore<State>({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  },
});
