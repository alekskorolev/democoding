<template>
  <div class="home">
    <ProfileList v-bind:profiles="$store.state.profile.profiles"></ProfileList>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProfileList from '@/components/ProfileList.vue';
import { ComponentOptions } from 'vue';
import { useStore } from 'vuex';

@Options({
  components: {
    ProfileList,
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
