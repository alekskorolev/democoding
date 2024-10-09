import {
  Mesh,
  TextureLoader,
  BoxGeometry,
  MeshBasicMaterial,
  Vector3,
} from 'three';

export class Box extends Mesh {
  static textureLoader: TextureLoader = new TextureLoader();

  private speed = 0;

  constructor() {
    const map = Box.textureLoader.load('img/crate.gif');
    const geometry = new BoxGeometry(20, 20, 20);
    const material = new MeshBasicMaterial({ map });
    super(geometry, material);
    this.position.z = -9600;
    this.position.x = Math.ceil(Math.random() * 5000 - 2500);
    this.position.y = Math.ceil(Math.random() * 6000 - 3000);
    this.speed = Math.ceil(Math.random() * 70) + 20;
  }

  public rotate(x = 0, y = 0, z = 0) {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;
  }

  public animate() {
    this.rotate(0.005, 0.01, -0.02);
    this.position.z += this.speed;
  }
}
