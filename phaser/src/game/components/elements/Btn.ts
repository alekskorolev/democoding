import { Scene, GameObjects } from 'phaser';

export interface BtnConfig {
  x: number
  y: number
  text: string
}

export type ClickFn = () => void;

const BASE_ALFA = 0.85;

export default class Btn {
  private scene: Scene;

  private sprite: GameObjects.Sprite;

  private text: GameObjects.Text;
  // private group: GameObjects.Group;

  constructor(scene: Scene, { x, y, text }: BtnConfig) {
    this.scene = scene;
    // this.group = this.scene.add.group();
    this.sprite = this.scene.add.sprite(x, y, 'btn').setInteractive({
      useHandCursor: true,
    });
    this.sprite.setAlpha(BASE_ALFA);
    this.text = this.scene.add.text(x - 250, y - 15, text, {
      fontSize: 26, fixedHeight: 30, fixedWidth: 500, align: 'center',
    });

    this.sprite.on('pointerover', () => {
      this.sprite.setAlpha(1);
      this.sprite.setScale(1.01);
    });
    this.sprite.on('pointerout', () => {
      this.sprite.setAlpha(BASE_ALFA);
      this.sprite.setScale(1);
    });
    this.sprite.on('pointerdown', () => {
      this.sprite.setScale(0.96);
    });
    this.sprite.on('pointerup', () => {
      this.sprite.setScale(1.01);
    });
  }

  destroy() {
    this.sprite.destroy();
    this.text.destroy();
  }

  move(x: number, y: number) {
    this.sprite.setPosition(x, y);
    this.text.setPosition(x - 250, y - 15);
  }

  onclick(fn: ClickFn) {
    this.sprite.on('pointerup', fn);
  }
}
