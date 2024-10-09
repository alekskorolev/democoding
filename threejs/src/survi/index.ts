import {
  AmbientLight,
  Raycaster, Scene, Vector2,
} from 'three';
import { MapControls } from './mapControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Camera } from './camera';
import { Renderer } from './renderer';
import { Box } from "../game/box";

export class SurviGame {
  private renderer: Renderer;

  private camera: Camera;

  private scene: Scene;

  private pointer: Vector2;

  private raycaster: Raycaster;

  private loader: GLTFLoader;

  private controls: MapControls;

  private generator?: number;

  private active = false;

  constructor(canvas: HTMLCanvasElement) {
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.scene = new Scene();
    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.loader = new GLTFLoader();
    const light = new AmbientLight( 0x808080 ); // soft white light
    this.scene.add( light );

    this.loader.load(
      'models/surface1.glb',
      (model: GLTF) => {
        this.scene.add(model.scene);
      }
    )
    const box = new Box();
    this.scene.add(box);
    box.position.z = -200;
    box.position.y = 0;
    box.position.x = 0;
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onWindowResize() {
    this.camera.onResize();
    this.renderer.onResize();
  }

  private stopGeneration() {
    clearInterval(this.generator);
    this.generator = undefined;
  }

  private animate() {
    this.renderer.render(this.scene, this.camera);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.controls.update();
    if (!this.active) return;
    requestAnimationFrame(() => this.animate());
  }

  public destroy() {
    window.removeEventListener('resize', this.onWindowResize);
    this.toogleState(false);
  }

  public toogleState(state?: boolean) {
    if (state === false || state === true) {
      this.active = state;
    } else {
      this.active = !this.active;
    }
    if (this.active) {
      // this.runGeneration()
      requestAnimationFrame(() => this.animate());
    } else {
      this.stopGeneration();
    }
  }
}
