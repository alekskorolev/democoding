import { Scene } from 'phaser';
import Btn from './elements/Btn';

export type MenuItem = [string, string];

export type ClickFn = (key: string) => void;

export default class ContextMenu {
  private btns: Array<Btn> = [];

  private scene: Scene;

  private clickFn?: ClickFn;

  private position: { x: number, y: number };

  constructor(scene: Scene, items: Array<MenuItem>, x = 0, y = 0) {
    this.position = { x, y };
    this.scene = scene;
    this.createButtons(items);
  }

  createButtons(items: Array<MenuItem>) {
    const { x, y } = this.position;
    const top = y - 50 * items.length;
    this.btns = items.map((item, i) => this.createBtn(item, i, x, top + i * 100));
  }

  onclick(fn: ClickFn) {
    this.clickFn = fn;
  }

  createBtn(item: MenuItem, i: number, x: number, y: number): Btn {
    const [key, text] = item;
    const btn = new Btn(this.scene, { x, y, text });
    btn.onclick(() => {
      if (this.clickFn) this.clickFn(key);
    });
    return btn;
  }

  setItems(items: Array<MenuItem>) {
    this.destroy();
    this.createButtons(items);
  }

  destroy() {
    this.btns.forEach((btn) => btn.destroy());
    this.btns = [];
  }

  move(x: number, y: number) {
    this.position = { x, y };
    this.btns.forEach((btn, i) => btn.move(x, y - 50 * this.btns.length + i * 100));
  }
}
