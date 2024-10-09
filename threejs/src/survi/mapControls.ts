import { MOUSE, TOUCH, Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class MapControls extends OrbitControls {
    public screenSpacePanning;

    public mouseButtons;

    public touches;

    constructor(camera: Camera, element: HTMLElement) {
      super(camera, element);
      this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
      this.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE };
      this.touches = { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE };
      this.enableDamping = true;
      this.dampingFactor = 0.05;
      this.minDistance = 100;
      this.maxDistance = 500;
      this.maxPolarAngle = Math.PI / 2;
    }
}

export { MapControls };
