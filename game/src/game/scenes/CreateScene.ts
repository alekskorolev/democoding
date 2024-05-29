import {
  Scene, Types, GameObjects,
} from 'phaser';
import { GAME_ASSETS_URL } from '@/config';
import Btn from '../components/elements/Btn';
import Menu, { MenuItem } from '../components/Menu';

const MAIN_MENU: Array<MenuItem> = [
  ['null', 'Выбор сценария'],
  ['create', 'Создать'],
  ['cancel', 'Отмена'],
];

export default class CreateScene extends Scene {
  back?: GameObjects.Image;

  btn?: Btn;

  menu?: Menu;

  constructor(config: Types.Scenes.SettingsConfig) {
    super({ key: 'create', ...config });
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
      if (key === 'create') {
        this.scene.start('tactic');
      }
      if (key === 'cancel') {
        this.scene.start('main');
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
