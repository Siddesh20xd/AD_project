# Banana Runner - Quick Start Guide

## Installation & Setup

The game is fully installed and ready to run. All dependencies have been configured.

```bash
npm run dev
```

This will start the Expo development server. Open it on your browser or mobile device.

## Game Features Implemented

✅ **Physics System** - Gravity-based jumping with smooth arcs
✅ **Gesture Controls** - Swipe up to jump, swipe down to slide
✅ **Endless Terrain** - Infinite scrolling ground
✅ **Parallax Background** - Three-layer depth effect
✅ **Obstacles** - Randomly spawned stones, logs, and holes with collision detection
✅ **Banana Collection** - Collectible items with floating animation
✅ **Scoring System** - 10 points per banana, persistent high score storage
✅ **UI Screens** - Home, Game, Pause, and Game Over screens
✅ **Sound System** - Ready for jump, collect, and game over effects

## How to Customize

### Replace Placeholder Graphics

1. **Player/Monkey** (`src/entities/Player.tsx`):
   - Replace the View with an Image component
   - Add your monkey sprite PNG

2. **Obstacles** (`src/entities/Obstacle.tsx`):
   - Add Images for stone, log, and hole types

3. **Banana** (`src/entities/Banana.tsx`):
   - Replace View with banana sprite Image

4. **Ground** (`src/entities/Ground.tsx`):
   - Add ground texture/pattern Image

5. **Background** (`src/entities/ParallaxBackground.tsx`):
   - Add parallax layer images (mountains, trees, clouds)

### Add Sound Effects

1. Place audio files in `src/assets/sounds/`
2. Update `src/hooks/useSoundEffects.ts`:

```typescript
const { sound } = await Audio.Sound.createAsync(
  require('../assets/sounds/jump.mp3')
);
await sound.playAsync();
```

### Adjust Game Parameters

Edit `src/utils/constants.ts`:
- `GRAVITY` - Physics gravity strength
- `JUMP_FORCE` - Jump power
- `GAME_SPEED` - Terrain scroll speed
- `SPAWN_INTERVAL` - Obstacle spawn frequency
- `BANANA_SPAWN_INTERVAL` - Banana spawn frequency
- `COLLISION_THRESHOLD` - Collision sensitivity
- Colors and sizes for all game elements

## Game Controls

- **Swipe UP** - Jump
- **Swipe DOWN** - Slide/Roll
- **Pause Button** - Pause game
- **Play Button** - Start new game

## Project Structure

```
src/
├── components/        # UI Components (GameUI, PauseMenu)
├── systems/          # Game Engine Systems (Physics, Spawners, Collision)
├── entities/         # Game Objects (Player, Obstacles, Banana, Ground, Background)
├── utils/            # Constants, Physics helpers, Storage
├── hooks/            # Custom React Hooks (useGameState, useSoundEffects)
├── screens/          # Game Screens (Home, Game, GameOver)
└── assets/           # Game Assets (sounds, images)
```

## How It Works

### Game Loop
1. **Physics System** - Updates player gravity and position
2. **Movement System** - Moves terrain, obstacles, bananas, and backgrounds
3. **Spawner Systems** - Randomly creates obstacles and bananas
4. **Collision System** - Detects collisions with obstacles and bananas
5. **Rendering** - Displays all game entities

### State Management
- `useGameState` hook manages game state (IDLE, PLAYING, PAUSED, GAME_OVER)
- Score and high score tracked via AsyncStorage (persistent)
- Game entities updated via react-native-game-engine

## Performance Notes

- Optimized for 60 FPS
- Automatic cleanup of off-screen objects
- Efficient collision detection
- Smooth animations with gesture handler

## Troubleshooting

If you see errors related to metro bundling:
1. Clear cache: `rm -rf .metro-cache`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Restart dev server

## Next Steps

1. Add your custom sprites and images
2. Add sound effects (jump, collect, game over)
3. Fine-tune game parameters for desired difficulty
4. Add power-ups or special effects
5. Expand obstacle and banana variety

## Ready to Play!

The game is fully functional. Just add your custom graphics and sounds to make it visually complete!
