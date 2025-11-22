import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@banana_runner_high_score';

export const saveHighScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

export const getHighScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};
