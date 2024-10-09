import { IGame } from './types';
import { ISurvivor } from './types/survivor';

export const NEW_SCENARY = (name: string): IGame => ({
  title: name,
  survivors: [],
  locations: [],
  quests: [],
  availableQuests: [],
  forposts: [],
});

export const NEW_SURVIVOR = (name: string): ISurvivor => ({
  nickname: name,
  inventory: {
    ceils: [],
    grid: { w: 5, h: 1 },
  },
  status: {
    health: 100,
    stamina: 100,
  },
  state: {
    intellectual: 10,
    inventive: 10,
    intuitive: 10,

    dextereous: 10,
    enduring: 10,
    strong: 10,

    smell: 10,
    sight: 10,
    hearing: 10,
  },
});
