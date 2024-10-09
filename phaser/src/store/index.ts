import { NEW_SCENARY } from '@/constants';
import { IState } from '@/types';
import { createStore } from 'vuex';

export default createStore<IState>({
  state: {
    scenarios: [
      NEW_SCENARY('Пустой сценарий'),
    ],
    saves: [],
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
