import { Scene } from "phaser";
export class Example extends Scene
{
  public logo: any
  constructor () {
    super();
  }

  preload () {
    this.load.setBaseURL('http://localhost:8080/');

    this.load.image('map', 'img/ds/map_1.png');
  }

  create () {
    this.add.image(1134, 516, 'map');
  }
  
}