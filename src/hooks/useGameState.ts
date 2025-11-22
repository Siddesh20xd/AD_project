import { useState, useCallback } from 'react';
import { GAME_STATE } from '../utils/constants';
import { getHighScore, saveHighScore } from '../utils/storage';

export const useGameState = () => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const loadHighScore = useCallback(async () => {
    const savedHighScore = await getHighScore();
    setHighScore(savedHighScore);
  }, []);

  const startGame = useCallback(() => {
    setGameState(GAME_STATE.PLAYING);
    setScore(0);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(GAME_STATE.PAUSED);
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(GAME_STATE.PLAYING);
  }, []);

  const gameOver = useCallback(async () => {
    setGameState(GAME_STATE.GAME_OVER);
    if (score > highScore) {
      setHighScore(score);
      await saveHighScore(score);
    }
  }, [score, highScore]);

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GAME_STATE.IDLE);
    setScore(0);
  }, []);

  return {
    gameState,
    score,
    highScore,
    loadHighScore,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    addScore,
    resetGame,
  };
};
