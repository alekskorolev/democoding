<template>
  <div class="row">
    <form class="col-4 offset-4" @submit.prevent="start">
      <legend>
              <fa-icon :icon="['fas', 'user']" /> Авторизация</legend>
      <fieldset class="mb-3 col-12">
        <input class="form-control" placeholder="Login" v-model="form.login">
      </fieldset>
      <fieldset class="mb-3 col-12">
        <input class="form-control" placeholder="Password" v-model="form.password">
      </fieldset>
      <fieldset class="mb-3 col-12">
        <input class="form-control" placeholder="Repeat password" v-model="form.repassword">
      </fieldset>
      <fieldset class="mb-3 col-12 form-check">
        <input class="form-check-input" type="checkbox" id="remember">
        <label class="form-check-label" for="remember">Remember me</label>
      </fieldset>
      <fieldset class="mb-3">
        <button class="btn btn-outline-dark col-12" type="submit">Войти</button>
      </fieldset>
      <fieldset class="social">
        <ul class="btn-group">
          <li class="btn btn-outline-dark"><i class="ti-facebook"></i></li>
          <li class="btn btn-outline-dark"><i class="ti-twitter"></i></li>
          <li class="btn btn-outline-dark"><i class="ti-google"></i></li>
          <li class="btn btn-outline-dark"><i class="ti-instagram"></i></li>
          <li class="btn btn-outline-dark"><i class="ti-github"></i></li>
        </ul>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { authKey, IAuthState } from '@/store/auth';
import { Store, useStore } from 'vuex';

@Options({
})
export default class Auth extends Vue {
  readonly store: Store<IAuthState>;
  
  constructor(...args: unknown[]) {
    super(...args);
    this.store = useStore(authKey);
  }

  async start() {
    this.store.dispatch('registration');
  }

  async _start() {
    this.store.dispatch('authenticate');
  }

  get form() {
    return this.store.state.reg;
  }
}
</script>

<style lang="scss" scoped>
fieldset.social {
  text-align: center;
  ul {
    padding-left: 0;
    
  }
}
</style>