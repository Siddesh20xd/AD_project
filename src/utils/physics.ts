export const checkCollision = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
  threshold: number = 0
) => {
  return (
    rect1.x < rect2.x + rect2.width - threshold &&
    rect1.x + rect1.width > rect2.x + threshold &&
    rect1.y < rect2.y + rect2.height - threshold &&
    rect1.y + rect1.height > rect2.y + threshold
  );
};
