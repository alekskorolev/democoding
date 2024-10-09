<template>
  <canvas
    ref="game"
    v-on:keydown="() => {}"
  ></canvas>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { SurviGame } from '../survi';
import DsGame from '@/deadstate';

@Options({
  components: {
  },
})
export default class HomeView extends Vue {
  public game!: SurviGame|DsGame;

  public initGame() {
    const canvas = this.$refs.game as HTMLCanvasElement;
    this.game = new DsGame(canvas);
  }

  public mounted(): void {
    this.initGame();
    // this.game.toogleState(true);
  }

  public beforeUnmount(): void {
    this.game.destroy();
  }
}
</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
