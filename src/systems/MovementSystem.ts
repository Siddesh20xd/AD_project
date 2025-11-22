import { CONSTANTS } from '../utils/constants';

const MovementSystem = (entities: any, { time }: any) => {
  if (!entities.gameState || entities.gameState.state !== 'PLAYING') {
    return entities;
  }

  Object.keys(entities).forEach((key) => {
    if (key.startsWith('ground')) {
      entities[key].body.position.x -= CONSTANTS.GAME_SPEED;
      if (entities[key].body.position.x <= -CONSTANTS.SCREEN_WIDTH) {
        entities[key].body.position.x = 0;
      }
    }

    if (key.startsWith('background')) {
      const layer = entities[key].body.layer;
      const speed = CONSTANTS.GAME_SPEED / (layer * 2);
      entities[key].body.position.x -= speed;
      if (entities[key].body.position.x <= -CONSTANTS.SCREEN_WIDTH) {
        entities[key].body.position.x = 0;
      }
    }

    if (key.startsWith('obstacle')) {
      entities[key].body.position.x -= CONSTANTS.GAME_SPEED;
      if (entities[key].body.position.x < -CONSTANTS.OBSTACLE_WIDTH) {
        delete entities[key];
      }
    }

    if (key.startsWith('banana')) {
      entities[key].body.position.x -= CONSTANTS.GAME_SPEED;
      entities[key].body.animationOffset = Math.sin(time.current / 200) * 10;
      if (entities[key].body.position.x < -CONSTANTS.BANANA_SIZE) {
        delete entities[key];
      }
    }
  });

  return entities;
};

export default MovementSystem;
