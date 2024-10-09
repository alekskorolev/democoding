import { login } from '@/api/auth';
import { authStorage } from '@/api/authStorage';
import { passwordValid, usernameValid } from '@/helers/validations';
import { AuthState } from '@/types/authState.d';
import { LoginForm } from '@/types/loginForm.d';
import { ActionContext } from 'vuex';

export default {
  namespaced: true,
  state: {
    loginForm: {
      username: 'sdf',
      password: '',
    },
    formError: '',
  },
  getters: {
  },
  mutations: {
    credentials(state: AuthState, payload: LoginForm) {
      state.loginForm = payload;
    },
    setError(state: AuthState, payload: string) {
      state.formError = payload;
    },
  },
  actions: {
    async login({ state, commit, dispatch }: ActionContext<AuthState, object>) {
      const { username, password } = state.loginForm;
      if (usernameValid(username) && passwordValid(password)) {
        const { success, error, accessToken } = await login(username, password);
        if (success && accessToken) {
          authStorage.token = accessToken;
          dispatch('profile/getUser', null, { root: true });
          console.log(accessToken);
        } else {
          commit('setError', error);
        }
      } else {
        throw new Error('Invalid username or password');
      }
    },
    logout({ dispatch }: ActionContext<AuthState, object>) {
      dispatch('profile/clearUser', null, { root: true });
      authStorage.token = null;
    },
  },
};
