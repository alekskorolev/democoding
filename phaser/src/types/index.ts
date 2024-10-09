import { ILivindLocation } from './livinglocation';
import { IMap } from './map';
import { IQuest } from './quest';
import { ISurvivor } from './survivor';

export interface IGame {
  title: string
  survivors: Array<ISurvivor>
  quests: Array<IQuest>
  headquarters?: ILivindLocation
  forposts: Array<ILivindLocation>
  locations: Array<IMap>
  start?: IQuest
  availableQuests: Array<IQuest>
}

export interface IState {
  scenarios: Array<IGame>
  game?: IGame
  saves: Array<IGame>
}
