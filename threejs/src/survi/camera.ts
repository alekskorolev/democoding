import {
  PerspectiveCamera,
} from 'three';

export class Camera extends PerspectiveCamera {
  constructor() {
    super(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.position.set( 400, 400, 0 );
  }

  public onResize() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.updateProjectionMatrix();
  }
}
