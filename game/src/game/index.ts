import {
  Game, WEBGL, Types,
} from 'phaser';
import MainScene from './scenes/MainScene';
import CreateScene from './scenes/CreateScene';
import MapScene from './scenes/MapScene';
import LocationScene from './scenes/LocationScene';
import ShattlerScene from './scenes/ShattlerScene';
import TacticScene from './scenes/TacticScene';
import EditTacticScene from './scenes/EditTacticScene';
import EditScene from './scenes/EditorScene';

export default function startGame(conf: Types.Core.GameConfig): Game {
  console.log(conf);
  const config = {
    type: WEBGL,
    scene: [
      MainScene,
      CreateScene,
      MapScene,
      LocationScene,
      ShattlerScene,
      TacticScene,
      EditScene,
      EditTacticScene,
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0, x: 0 },
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'phaser-example',
      width: '100%',
      height: '100%',
    },
  };
  const game = new Game({ ...config, ...conf });
  return game;
}

export { Game };
