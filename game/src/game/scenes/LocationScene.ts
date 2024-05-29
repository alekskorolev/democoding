import {
  Scene, Types, GameObjects,
} from 'phaser';
import { GAME_ASSETS_URL } from '@/config';
import Btn from '../components/elements/Btn';
import Menu, { MenuItem } from '../components/Menu';

const MAIN_MENU: Array<MenuItem> = [
  ['null', 'Гуляем по карте'],
  ['map', 'На карту'],
  ['tactic', 'Бой'],
];

export default class LocationScene extends Scene {
  back?: GameObjects.Image;

  btn?: Btn;

  menu?: Menu;

  constructor(config: Types.Scenes.SettingsConfig) {
    super({ key: 'location', ...config });
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
      if (key === 'map') {
        this.scene.start('map');
      }
      if (key === 'tactic') {
        this.scene.start('tactic');
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
