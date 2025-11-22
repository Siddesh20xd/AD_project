import { CONSTANTS } from '../utils/constants';
import Banana from '../entities/Banana';

let lastBananaSpawnTime = 0;
let bananaCounter = 0;

const BananaSpawner = (entities: any, { time }: any) => {
  if (!entities.gameState || entities.gameState.state !== 'PLAYING') {
    return entities;
  }

  if (time.current - lastBananaSpawnTime > CONSTANTS.BANANA_SPAWN_INTERVAL) {
    const bananaKey = `banana_${bananaCounter++}`;
    const groundY = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.GROUND_HEIGHT;
    const randomHeight = Math.random() * 150 + 50;

    entities[bananaKey] = {
      body: {
        position: {
          x: CONSTANTS.SCREEN_WIDTH + 50,
          y: groundY - randomHeight,
        },
        animationOffset: 0,
      },
      renderer: Banana,
    };

    lastBananaSpawnTime = time.current;
  }

  return entities;
};

export const resetBananaSpawner = () => {
  lastBananaSpawnTime = 0;
  bananaCounter = 0;
};

export default BananaSpawner;
