import { auth } from '@/api';
import { IRegData } from '@libs/shared';
import { IAuthData } from 'shared/types';
import { InjectionKey } from 'vue';
import { Store, createStore } from 'vuex';

export interface IAuthState {
  reg: IRegData;
  auth: IAuthData;
};

export const authKey: InjectionKey<Store<IAuthState>> = Symbol('authState');

export default createStore<IAuthState>({
  state: {
    reg: {
      login: 'test',
      password: '',
      repassword: '',
    },
    auth: {
      login: '',
      password: '',
      remember: false,
    },
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async registration({ state }) {
      return auth.registration(state.reg);
    },
    async authenticate({ state }) {
      return auth.authenticate(state.auth);
    }
  },
});
