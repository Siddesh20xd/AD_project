import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';

interface HomeScreenProps {
  onStartGame: () => void;
  highScore: number;
  loadHighScore: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, highScore, loadHighScore }) => {
  useEffect(() => {
    loadHighScore();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>BANANA RUNNER</Text>
        <Text style={styles.subtitle}>Endless Adventure</Text>

        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>High Score</Text>
          <Text style={styles.highScore}>{highScore}</Text>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={onStartGame}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Swipe UP to Jump</Text>
          <Text style={styles.instructionText}>Swipe DOWN to Slide</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SKY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    marginBottom: 40,
  },
  highScoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 40,
  },
  highScoreLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  highScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  playButtonText: {
    color: COLORS.TEXT,
    fontSize: 28,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 50,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
});

export default HomeScreen;
