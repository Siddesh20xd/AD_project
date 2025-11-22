import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  onRestart,
  onHome,
}) => {
  const isNewHighScore = score >= highScore;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>GAME OVER</Text>

        {isNewHighScore && (
          <Text style={styles.newHighScore}>NEW HIGH SCORE!</Text>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>Best</Text>
          <Text style={styles.highScore}>{highScore}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={onHome}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 300,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  newHighScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  highScoreLabel: {
    fontSize: 14,
    color: '#888',
  },
  highScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
  },
  homeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameOverScreen;
