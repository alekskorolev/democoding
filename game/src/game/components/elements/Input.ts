import { Scene, GameObjects } from 'phaser';

export interface InputConfig {
  x: number
  y: number
  placeholder: string
}

const BASE_ALFA = 0.85;

export default class Btn {
  private scene: Scene;

  private sprite: GameObjects.Sprite;

  private placeholder: GameObjects.Text;
  // private group: GameObjects.Group;

  constructor(scene: Scene, { x, y, placeholder }: InputConfig) {
    this.scene = scene;

    this.sprite = this.scene.add.sprite(x, y, 'btn').setInteractive({
      cursor: 'pointer'
    });
    this.sprite.setAlpha(BASE_ALFA);
    this.placeholder = this.scene.add.text(x - 250, y - 15, placeholder, {
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
    this.sprite.on('pointerup', () => {
      
    });
  }
}
