import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { CONSTANTS, COLORS, GAME_STATE } from '../utils/constants';
import Player from '../entities/Player';
import Ground from '../entities/Ground';
import ParallaxBackground from '../entities/ParallaxBackground';
import Physics from '../systems/Physics';
import MovementSystem from '../systems/MovementSystem';
import ObstacleSpawner, { resetObstacleSpawner } from '../systems/ObstacleSpawner';
import BananaSpawner, { resetBananaSpawner } from '../systems/BananaSpawner';
import CollisionSystem from '../systems/CollisionSystem';
import GameUI from '../components/GameUI';
import PauseMenu from '../components/PauseMenu';
import GameOverScreen from './GameOverScreen';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface GameScreenProps {
  gameState: string;
  score: number;
  highScore: number;
  onPause: () => void;
  onResume: () => void;
  onGameOver: () => void;
  onAddScore: (points: number) => void;
  onRestart: () => void;
  onHome: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  score,
  highScore,
  onPause,
  onResume,
  onGameOver,
  onAddScore,
  onRestart,
  onHome,
}) => {
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [entities, setEntities] = useState<any>(null);
  const { playJump, playCollect, playGameOver } = useSoundEffects();

  useEffect(() => {
    setupEntities();
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING && gameEngineRef.current) {
      gameEngineRef.current.swap(entities);
    }
  }, [gameState]);

  const setupEntities = () => {
    const groundY = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.GROUND_HEIGHT;
    const playerY = groundY - CONSTANTS.PLAYER_HEIGHT;

    const initialEntities = {
      player: {
        body: {
          position: { x: 50, y: playerY },
          velocity: { x: 0, y: 0 },
          isJumping: false,
          isSliding: false,
        },
        renderer: Player,
      },
      ground1: {
        body: {
          position: { x: 0, y: groundY },
        },
        renderer: Ground,
      },
      ground2: {
        body: {
          position: { x: CONSTANTS.SCREEN_WIDTH, y: groundY },
        },
        renderer: Ground,
      },
      background1: {
        body: {
          position: { x: 0, y: 0 },
          layer: 1,
        },
        renderer: ParallaxBackground,
      },
      background2: {
        body: {
          position: { x: CONSTANTS.SCREEN_WIDTH, y: 0 },
          layer: 1,
        },
        renderer: ParallaxBackground,
      },
      gameState: {
        state: gameState,
      },
    };

    setEntities(initialEntities);
  };

  const handleEvent = (e: any) => {
    if (e.type === 'game-over') {
      playGameOver();
      onGameOver();
    } else if (e.type === 'banana-collected') {
      playCollect();
      onAddScore(10);
    }
  };

  const handleSwipe = (direction: 'up' | 'down') => {
    if (gameState !== GAME_STATE.PLAYING || !entities) return;

    const player = entities.player.body;

    if (direction === 'up' && !player.isJumping) {
      player.velocity.y = CONSTANTS.JUMP_FORCE;
      player.isJumping = true;
      playJump();
    } else if (direction === 'down' && !player.isSliding) {
      player.isSliding = true;
      setTimeout(() => {
        if (entities?.player?.body) {
          entities.player.body.isSliding = false;
        }
      }, 500);
    }
  };

  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      const { velocityY } = e;
      if (velocityY < -500) {
        handleSwipe('up');
      } else if (velocityY > 500) {
        handleSwipe('down');
      }
    });

  const handleRestart = () => {
    resetObstacleSpawner();
    resetBananaSpawner();
    setupEntities();
    onRestart();
  };

  if (!entities) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <GameEngine
          ref={gameEngineRef}
          style={styles.gameEngine}
          systems={[
            Physics,
            MovementSystem,
            ObstacleSpawner,
            BananaSpawner,
            CollisionSystem,
          ]}
          entities={entities}
          running={gameState === GAME_STATE.PLAYING}
          onEvent={handleEvent}
        />

        {gameState === GAME_STATE.PLAYING && (
          <GameUI score={score} onPause={onPause} />
        )}

        {gameState === GAME_STATE.PAUSED && (
          <PauseMenu onResume={onResume} onQuit={onHome} />
        )}

        {gameState === GAME_STATE.GAME_OVER && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            onRestart={handleRestart}
            onHome={onHome}
          />
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SKY,
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GameScreen;
