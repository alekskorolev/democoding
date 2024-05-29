<template>
  <div class="container">
    <Auth></Auth>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Auth from '@/components/Auth.vue';

@Options({
  components: {
    Auth,
  },
})
export default class HomeView extends Vue {}
</script>
