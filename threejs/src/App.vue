<template>
  <router-view  v-if="$store.state.profile.user"/>
  <Auth
    v-else
    v-bind:credentials="$store.state.auth.loginForm"
    @submit="onSubmit"
    @input="onInput"
  ></Auth>
</template>

<script lang="ts">
import { ComponentOptions } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Auth from '@/components/Auth.vue';
import { LoginForm } from './types/loginForm';

@Options({
  components: {
    Auth,
  },
})
export default class AppView extends Vue {
  constructor(props: ComponentOptions) {
    const store = useStore();
    store.dispatch('profile/getUser');
    super(props);
  }

  public async onLogin() {
    console.log(this.$store);
  }

  public async onInput(event: LoginForm) {
    this.$store.commit('auth/credentials', event);
  }

  public async onSubmit() {
    this.$store.dispatch('auth/login');
    console.log(this.$store.profile);
  }
}
</script>

<style lang="scss">
html, body, #app {
  margin: 0;
  min-height: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: url('@/assets/menu_bg.jpg') no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
