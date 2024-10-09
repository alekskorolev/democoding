<template>
  <div class="button">
    {{ title }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

  @Options({
    props: {
      title: String,
    },
  })
export default class MenuButton extends Vue {
    public title!: string
}
</script>

<style lang="scss">
.button {
  margin: 5px 30px;
  padding: 10px 0;
  border: 2px solid #7f4824;
  border-radius: 5px;
  background: url('@/assets/menu_button_bg.jpg');
  background-size: cover;
  color: #443322;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 18px;
  cursor: crosshair;
  &:hover {
    opacity: 0.8;
  }
}
</style>
