<template>
  <div class="menu panel">
    <MenuButton v-bind:title="$t('Новая игра')" v-on:click="onNewGameStart"></MenuButton>
    <MenuButton v-bind:title="$t('Загрузить')" v-on:click="onGameLoad"></MenuButton>
    <MenuButton v-bind:title="$t('Выход')" v-on:click="onLogout"></MenuButton>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MenuButton from './Button.vue';

  @Options({
    components: {
      MenuButton,
    },
  })
export default class MainMenu extends Vue {
  public onLogout() {
    this.$store.dispatch('auth/logout');
  }

  public onNewGameStart() {
    this.$router.push('/new');
  }

  public onGameLoad() {
    this.$router.push('/saved');
  }
}
</script>

<style scoped lang="scss">
@import './menuBlock.scss';
</style>
