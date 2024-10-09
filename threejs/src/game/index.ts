import {
  Object3D, Raycaster, Scene, Vector2, Vector3,
} from 'three';
import { Camera } from './camera';
import { Renderer } from './renderer';
import { Box } from './box';

export class Game {
  private renderer: Renderer;

  private camera: Camera;

  private scene: Scene;

  private active = false;

  private pointer: Vector2;

  private raycaster: Raycaster;

  private selected?: Object3D;

  private generator?: any;

  constructor(canvas: HTMLCanvasElement) {
    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.scene = new Scene();
    window.addEventListener('resize', () => this.onWindowResize());
    document.addEventListener('mousemove', (event: MouseEvent) => this.onPointerMove(event));
    document.addEventListener('click', (event: MouseEvent) => this.onInteract(event));
  }

  private onWindowResize() {
    this.camera.onResize();
    this.renderer.onResize();
  }

  private onPointerMove(event: MouseEvent) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onInteract(event: MouseEvent) {
    if (this.selected) {
      this.scene.remove(this.selected);
    }
  }

  private runGeneration() {
    this.generator = setInterval(() => {
      const box = new Box();
      this.add(box);
    }, 1000);
  }

  private stopGeneration() {
    clearInterval(this.generator);
    this.generator = undefined;
  }

  private animate() {
    this.scene.children.forEach((object: Object3D|Box) => {
      object instanceof Box && object.animate();
      if (object.position.z > 400) {
        this.scene.remove(object);
      }
    });
    this.renderer.render(this.scene, this.camera);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (intersects.length > 0) {
      this.selected = intersects[0].object;
    } else {
      this.selected = undefined;
    }
    if (!this.active) return;
    requestAnimationFrame(() => this.animate());
  }

  public add(mesh: Box) {
    this.scene.add(mesh);
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
      this.runGeneration();
      requestAnimationFrame(() => this.animate());
    } else {
      this.stopGeneration();
    }
  }
}
