import { checkCollision } from '../utils/physics';
import { CONSTANTS } from '../utils/constants';

const CollisionSystem = (entities: any, { events }: any) => {
  if (!entities.gameState || entities.gameState.state !== 'PLAYING') {
    return entities;
  }

  const player = entities.player.body;
  const playerRect = {
    x: player.position.x,
    y: player.position.y,
    width: CONSTANTS.PLAYER_WIDTH,
    height: player.isSliding ? CONSTANTS.PLAYER_HEIGHT / 2 : CONSTANTS.PLAYER_HEIGHT,
  };

  Object.keys(entities).forEach((key) => {
    if (key.startsWith('obstacle')) {
      const obstacle = entities[key].body;
      const obstacleRect = {
        x: obstacle.position.x,
        y: obstacle.position.y,
        width: CONSTANTS.OBSTACLE_WIDTH,
        height: CONSTANTS.OBSTACLE_HEIGHT,
      };

      if (checkCollision(playerRect, obstacleRect, CONSTANTS.COLLISION_THRESHOLD)) {
        events.push({ type: 'game-over' });
      }
    }

    if (key.startsWith('banana')) {
      const banana = entities[key].body;
      const bananaRect = {
        x: banana.position.x,
        y: banana.position.y,
        width: CONSTANTS.BANANA_SIZE,
        height: CONSTANTS.BANANA_SIZE,
      };

      if (checkCollision(playerRect, bananaRect)) {
        delete entities[key];
        events.push({ type: 'banana-collected' });
      }
    }
  });

  return entities;
};

export default CollisionSystem;
