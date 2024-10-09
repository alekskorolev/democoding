<template>
  <div class="home">
    <ProfileCreate v-bind:profiles="$store.state.profile.profiles"></ProfileCreate>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ComponentOptions } from 'vue';
import { useStore } from 'vuex';
import ProfileCreate from '../components/ProfileCreate.vue';

  @Options({
    components: {
      ProfileCreate,
    },
  })
export default class HomeView extends Vue {
  constructor(props: ComponentOptions) {
    const store = useStore();
    store.dispatch('profile/getProfiles').then(() => console.log(store));
    super(props);
  }
}
</script>

<style lang="scss">
</style>
