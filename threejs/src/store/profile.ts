import { user } from '@/api/auth';
import { ActionContext } from 'vuex';
import { ProfileEntity } from '@/types/api.d';
import { ProfileState } from '@/types/profileState.d';
import { createProfile, getProfiles, uploadAvatar } from '@/api/profile';

export default {
  namespaced: true,
  state: {
    user: null,
    profiles: [],
    newProfile: {
      nickname: '',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    },
  },
  mutations: {
    user(state: ProfileState, payload: ProfileEntity) {
      state.user = payload;
    },
    profiles(state: ProfileState, payload: Array<ProfileEntity>) {
      state.profiles = payload;
    },
    setNewAvatar(state: ProfileState, payload: string) {
      state.newProfile.avatar = payload;
    },
    setCurrentProfile(state: ProfileState, payload: ProfileEntity) {
      console.log(payload);
    },
  },
  actions: {
    async getUser({ commit }: ActionContext<ProfileState, object>) {
      const { success, error, profile } = await user();
      if (success && profile) {
        commit('user', profile);
      } else {
        console.log('profile error', error);
      }
    },
    clearUser({ commit }: ActionContext<ProfileState, object>) {
      commit('user', null);
    },
    async getProfiles({ commit }: ActionContext<ProfileState, object>) {
      const { success, error, profiles } = await getProfiles();
      if (success && profiles) {
        commit('profiles', profiles);
      } else {
        console.log('profiles load error', error);
      }
    },
    async uploadAvatar({ commit }: ActionContext<ProfileState, object>, file: File) {
      const { success, error, fileurl } = await uploadAvatar(file);
      if (success && fileurl) {
        commit('setNewAvatar', fileurl);
      } else {
        console.error(error);
      }
    },
    async saveProfile({ state, commit }: ActionContext<ProfileState, object>) {
      const { success, error, profile } = await createProfile(state.newProfile);
      if (success && profile) {
        commit('setCurrentProfile', profile);
      } else {
        console.error(error);
      }
    },
  },
};
