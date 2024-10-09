import {
  Scene, Types, GameObjects, Input,
} from 'phaser';
import { GAME_ASSETS_URL } from '@/config';

export default class TacticScene extends Scene {
  back?: GameObjects.Image;

  constructor(config: Types.Scenes.SettingsConfig) {
    super({ key: 'tactic', ...config });
  }

  preload() {
    this.load.setBaseURL(`${GAME_ASSETS_URL}/game/`);
    this.load.image('ground', 'grid2.gif');
  }

  create() {
    const texture = this.textures.createCanvas('canvastexture', 2000, 8000);
    const grass = this.textures.get('ground').getSourceImage();
    texture?.draw(0, 0, grass as HTMLImageElement);
    this.back = this.add.image(0, 0, 'canvastexture').setOrigin(0);
    this.back = this.add.image(0, 2000, 'canvastexture').setOrigin(0);
    this.back = this.add.image(0, 4000, 'canvastexture').setOrigin(0);
    this.back = this.add.image(0, 6000, 'canvastexture').setOrigin(0);
    this.scale.on('resize', this.resize, this);
    this.startMove();
  }

  startMove() {
    let sx = 1000;
    let sy = 7400;
    let nx = sx;
    let ny = sy;
    this.cameras.main.centerOn(sx, sy);
    let draw = false;
    this.input.on('pointerdown', () => {
      draw = true;
    });
    this.input.on('pointerup', () => {
      draw = false;
      sx = nx;
      sy = ny;
    });
    this.input.on('pointermove', (event: Input.Pointer) => {
      if (!draw) return;
      const {
        x, y, downX, downY,
      } = event;
      const dx = x - downX;
      const dy = y - downY;
      ny = sy - dy;
      nx = sx - dx;
      this.cameras.main.centerOn(nx, ny);
    });
  }

  resize(gameSize: { height: number, width: number }) {
    const { width } = gameSize;
    const { height } = gameSize;
    this.cameras.resize(width, height);
  }
}
