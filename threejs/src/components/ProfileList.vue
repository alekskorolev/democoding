<template>
  <div class="profiles panel">
    <ul>
      <li
        v-for="profile in profiles"
        v-bind:key="profile.id"
        v-on:click="() => onStartGame(profile)"
        v-on:keydown="$event => $event"
      >
        <img v-bind:src="profile.avatar" v-bind:alt="profile.username">
        <span>{{ profile.username }}</span>
      </li>
    </ul>
    <MenuButton v-on:click="onBack" v-bind:title="$t('Назад')"></MenuButton>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { GameProfile } from '../types/profileState';
import MenuButton from './Button.vue';

@Options({
  components: {
    MenuButton,
  },
  props: {
    profiles: Array,
  },
})
export default class ProfileList extends Vue {
  public profiles!: Array<GameProfile>

  public onStartGame(profile: GameProfile) {
    this.$router.push('/game');
    console.log(profile);
  }

  public onBack() {
    this.$router.back();
  }
}
</script>

<style lang="scss" scoped>
  @import './menuBlock.scss';
  ul {
    list-style-type: none;
    padding: 0;
    li {
      text-align: left;
      cursor: pointer;
      padding: 0 10px;
      margin-bottom: 10px;
      &:hover {
        background-color: rgba($color: #000000, $alpha: 0.3);
      }
      img {
        width: 135px;
        height: 135px;
        margin-right: 10px;
      }
      span {
        text-transform: capitalize;
        font-size: 32px;
        position: relative;
        top: -100px;
      }
    }
  }
</style>
