import { Game, AUTO, WEBGL, Scale } from "phaser";
import { Example } from "./example.scene";


export default class DsGame {
  private game: Game;
  constructor(canvas: HTMLCanvasElement) {
    const parentElement = canvas.parentElement as HTMLDivElement;
    const { clientWidth, clientHeight } = canvas.parentElement as HTMLDivElement
    const config = {
      type: WEBGL,
      width: clientWidth,
      height: clientHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scale: {
        mode: Scale.NONE,
        width: clientWidth,
        height: clientHeight,
        zoom: 1
      },
      canvas,
      scene: Example
    };

    this.game = new Game(config);
    window.addEventListener('resize', () => this.onResize(parentElement))
  }

  destroy() {
    this.game.destroy(false)
  }

  onResize(el: HTMLDivElement) {
    console.log(el)
    const { clientWidth, clientHeight } = el
    this.game.canvas.height = clientHeight
    this.game.canvas.width = clientWidth
    this.game.scale.resize(clientWidth, clientHeight)    
  }
}
