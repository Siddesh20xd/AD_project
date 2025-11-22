import { CONSTANTS } from '../utils/constants';

const Physics = (entities: any, { time }: any) => {
  const player = entities.player.body;

  if (player.velocity) {
    player.velocity.y += CONSTANTS.GRAVITY;
    player.position.y += player.velocity.y;

    const groundY = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.GROUND_HEIGHT - CONSTANTS.PLAYER_HEIGHT;
    if (player.position.y >= groundY) {
      player.position.y = groundY;
      player.velocity.y = 0;
      player.isJumping = false;
    }

    if (player.position.y < 0) {
      player.position.y = 0;
      player.velocity.y = 0;
    }
  }

  return entities;
};

export default Physics;
