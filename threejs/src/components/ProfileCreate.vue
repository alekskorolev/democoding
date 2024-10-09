<template>
  <div class="profile panel">
    <form>
      <fieldset class="nickname">
        <label for="nickname">
          <input name="nickname" v-model="$store.state.profile.newProfile.nickname">
        </label>
      </fieldset>
      <fieldset class="avatar">
        <img
          v-bind:src="$store.state.profile.newProfile.avatar"
          v-on:click="onAvatarDialog"
          alt="Select avatar image"
          v-on:keydown="() => {}"
        >
      </fieldset>
    </form>
    <MenuButton v-on:click="onStartGame" v-bind:title="$t('Начать игру')"></MenuButton>
    <MenuButton v-on:click="onBack" v-bind:title="$t('Назад')"></MenuButton>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { GameProfile } from '@/types/profileState.d';
import MenuButton from './Button.vue';

@Options({
  components: {
    MenuButton,
  },
  props: {
    profiles: Array,
  },
})
export default class ProfileCreate extends Vue {
  public profiles!: Array<GameProfile>

  public onStartGame(event: MouseEvent) {
    console.log(event);
    this.$store.dispatch('profile/saveProfile');
    this.$router.push('/game');
  }

  public onBack() {
    this.$router.back();
  }

  public onAvatarDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    const listener = (event: Event) => {
      const target: HTMLInputElement = event.target as HTMLInputElement;
      const file = target.files && target.files[0];
      this.$store.dispatch('profile/uploadAvatar', file);
      input.removeEventListener('change', listener);
      input.remove();
    };
    input.addEventListener('change', listener);
    input.click();
  }
}
</script>

<style lang="scss" scoped>
  @import './menuBlock.scss';
  .nickname {
    width: 60%;
  }
  .avatar {
    width: 35%;
    img {
      width: 100px;
      height: 100px;
    }
  }
</style>
