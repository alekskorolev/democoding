<template>
  <span></span>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { Options, Vue } from 'vue-class-component';
import stateGame, { Game } from './game';

  @Options({
    components: {
    },
  })
export default class AppView extends Vue {
    state = reactive({
      height: 0,
      width: 0,
    });

    get style() {
      const { height, width } = this.state;
      return {
        height: `${height}px`,
        width: `${width}px`,
      };
    }

    game?: Game;

    private listener: () => void;

    constructor(...args: Array<any>) {
      super(...args);
      this.setStyle();
      this.listener = () => this.setStyle();
    }

    setStyle() {
      this.state.height = window.innerHeight;
      this.state.width = window.innerWidth;
    }

    beforeMount(): void {
      window.addEventListener('resize', this.listener);
    }

    mounted(): void {
      const game = stateGame({});
      this.game = game;
    }

    beforeUnmount(): void {
      window.removeEventListener('resize', this.listener);
      this.game?.destroy(true);
    }
}
</script>

<style lang="scss">
body, #app {
    overflow: hidden;
    margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
