import { CONSTANTS } from '../utils/constants';
import Obstacle from '../entities/Obstacle';

let lastSpawnTime = 0;
let obstacleCounter = 0;

const ObstacleSpawner = (entities: any, { time }: any) => {
  if (!entities.gameState || entities.gameState.state !== 'PLAYING') {
    return entities;
  }

  if (time.current - lastSpawnTime > CONSTANTS.SPAWN_INTERVAL) {
    const obstacleTypes: ('stone' | 'log' | 'hole')[] = ['stone', 'log', 'hole'];
    const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    const obstacleKey = `obstacle_${obstacleCounter++}`;
    const groundY = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.GROUND_HEIGHT;

    entities[obstacleKey] = {
      body: {
        position: {
          x: CONSTANTS.SCREEN_WIDTH + 50,
          y: groundY - CONSTANTS.OBSTACLE_HEIGHT,
        },
        type: randomType,
      },
      renderer: Obstacle,
    };

    lastSpawnTime = time.current;
  }

  return entities;
};

export const resetObstacleSpawner = () => {
  lastSpawnTime = 0;
  obstacleCounter = 0;
};

export default ObstacleSpawner;
