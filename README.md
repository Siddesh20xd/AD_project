# Banana Runner - 2D Endless Runner Game

A complete 2D endless runner game built with React Native, Expo, react-native-game-engine, and matter-js.

## Features

- **Character Runner**: Monkey-like character with jump and slide mechanics
- **Endless Terrain**: Infinite scrolling ground with parallax background (3 layers)
- **Obstacles**: Randomly generated stones, logs, and holes with collision detection
- **Banana Collection**: Collectible bananas with floating animations
- **UI Screens**: Home, Game, Pause, and Game Over screens
- **Score System**: Score tracking with persistent high score (AsyncStorage)
- **Sound Effects**: Jump, collect, game over sounds, and background music support
- **Gesture Controls**: Swipe up to jump, swipe down to slide

## Game Controls

- **Swipe UP**: Make the monkey jump
- **Swipe DOWN**: Make the monkey slide/roll

## Project Structure

```
/src
  /components      - Reusable UI components (GameUI, PauseMenu)
  /systems         - Game engine systems (Physics, Spawners, Collision)
  /entities        - Game entities (Player, Obstacle, Banana, Ground, Background)
  /utils           - Constants, physics helpers, storage
  /hooks           - Custom hooks (useGameState, useSoundEffects)
  /screens         - Game screens (Home, Game, GameOver)
  /assets          - Game assets (sounds, images)
```

## How to Run

```bash
npm install
npm run dev
```

## Replacing Placeholder Graphics

The game currently uses basic colored shapes as placeholders. To use actual sprites:

1. **Player/Monkey**: Replace the View in `src/entities/Player.tsx` with an Image component pointing to your monkey sprite
2. **Obstacles**: Replace Views in `src/entities/Obstacle.tsx` with Images for stone, log, and hole sprites
3. **Banana**: Replace View in `src/entities/Banana.tsx` with a banana sprite Image
4. **Ground**: Replace View in `src/entities/Ground.tsx` with a ground texture/pattern Image
5. **Background**: Replace Views in `src/entities/ParallaxBackground.tsx` with parallax layer Images (mountains, trees, clouds)

## Adding Sound Effects

The sound system is already integrated. To add actual sounds:

1. Place your sound files in `src/assets/sounds/`
2. Update the file paths in `src/hooks/useSoundEffects.ts`:
   - Jump sound
   - Collect sound (banana)
   - Game over sound
   - Background music

Example:
```typescript
const { sound } = await Audio.Sound.createAsync(
  require('../assets/sounds/jump.mp3')
);
```

## Game Mechanics

- **Physics**: Gravity-based jumping with smooth arcs
- **Collision**: Precise collision detection with configurable threshold
- **Spawning**: Random obstacle and banana generation
- **Scoring**: 10 points per banana collected
- **High Score**: Automatically saved and persisted

## Performance

The game is optimized to run at 60 FPS with:
- Efficient entity management
- Automatic cleanup of off-screen objects
- Optimized collision detection
- Smooth animations

## Customization

Edit `src/utils/constants.ts` to customize:
- Game speed
- Jump force
- Spawn intervals
- Object sizes
- Colors
- And more...

## Technologies Used

- **React Native** - Mobile framework
- **Expo SDK** - Development platform
- **react-native-game-engine** - Game loop and entity management
- **matter-js** - Physics engine
- **react-native-reanimated** - Smooth animations
- **react-native-gesture-handler** - Touch gestures
- **expo-av** - Audio playback
- **AsyncStorage** - Persistent storage

## Future Enhancements

- Power-ups (invincibility, magnet, double points)
- Multiple characters to unlock
- Different environments/themes
- Achievements system
- Leaderboard integration
- Progressive difficulty increase
