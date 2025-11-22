import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useSoundEffects = () => {
  const [jumpSound, setJumpSound] = useState<Audio.Sound | null>(null);
  const [collectSound, setCollectSound] = useState<Audio.Sound | null>(null);
  const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  const loadSounds = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.log('Error setting audio mode:', error);
    }
  };

  const unloadSounds = async () => {
    if (jumpSound) await jumpSound.unloadAsync();
    if (collectSound) await collectSound.unloadAsync();
    if (gameOverSound) await gameOverSound.unloadAsync();
    if (backgroundMusic) await backgroundMusic.unloadAsync();
  };

  const playJump = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: '' }
      );
      await sound.playAsync();
      setJumpSound(sound);
    } catch (error) {
      console.log('Error playing jump sound:', error);
    }
  };

  const playCollect = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: '' }
      );
      await sound.playAsync();
      setCollectSound(sound);
    } catch (error) {
      console.log('Error playing collect sound:', error);
    }
  };

  const playGameOver = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: '' }
      );
      await sound.playAsync();
      setGameOverSound(sound);
    } catch (error) {
      console.log('Error playing game over sound:', error);
    }
  };

  const playBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: '' },
        { isLooping: true }
      );
      await sound.playAsync();
      setBackgroundMusic(sound);
    } catch (error) {
      console.log('Error playing background music:', error);
    }
  };

  const stopBackgroundMusic = async () => {
    if (backgroundMusic) {
      await backgroundMusic.stopAsync();
      await backgroundMusic.unloadAsync();
    }
  };

  return {
    playJump,
    playCollect,
    playGameOver,
    playBackgroundMusic,
    stopBackgroundMusic,
  };
};
