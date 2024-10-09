import {
  WebGLRenderer,
} from 'three';

export class Renderer extends WebGLRenderer {
  constructor(canvas: HTMLCanvasElement) {
    super({ canvas, antialias: true });
    this.setPixelRatio(window.devicePixelRatio);
    this.setSize(window.innerWidth, window.innerHeight);
  }

  public onResize() {
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
