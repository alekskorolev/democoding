import {
  Scene, Types, GameObjects,
} from 'phaser';
import { GAME_ASSETS_URL } from '@/config';
import Menu, { MenuItem } from '../components/Menu';

const MAIN_MENU: Array<MenuItem> = [
  ['new', 'Новая игра'],
  ['load', 'Загрузить'],
  ['settings', 'Настройки'],
  ['edit', 'Редктор'],
  ['exit', 'Выход'],
];

interface Submenu {
  [key: string]: Array<MenuItem>;
}

const SUB_MENUS: Submenu = {
  settings: [
    ['graphic', 'Графика'],
    ['game', 'Игровые настройки'],
    ['main', 'Главное меню'],
  ],
};

export default class MainScene extends Scene {
  back?: GameObjects.Image;

  menu?: Menu;

  constructor(config: Types.Scenes.SettingsConfig) {
    super({ key: 'main', ...config });
  }

  preload() {
    this.load.setBaseURL(`${GAME_ASSETS_URL}/game/ui/`);

    this.load.image('back', 'back.jpg');
    this.load.image('btn', 'btn.png');
  }

  create() {
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2;
    this.back = this.add.image(x, y, 'back');
    this.menu = new Menu(this, MAIN_MENU, x, y);
    this.menu.onclick((key: string) => {
      if (SUB_MENUS[key]) {
        this.menu?.setItems(SUB_MENUS[key]);
      }
      if (key === 'main') {
        this.menu?.setItems(MAIN_MENU);
      }
      if (key === 'new') {
        this.scene.start('shattler');
      }
      if (key === 'edit') {
        this.scene.start('editor');
      }
      console.log('click', key);
    });
    this.scale.on('resize', this.resize, this);
  }

  resize(gameSize: { height: number, width: number }) {
    const { width } = gameSize;
    const { height } = gameSize;
    this.cameras.resize(width, height);
    this.back?.setPosition(width / 2, height / 2);
    this.menu?.move(width / 2, height / 2);
  }
}
