import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';
import { Pause } from 'lucide-react-native';

interface GameUIProps {
  score: number;
  onPause: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ score, onPause }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity onPress={onPause} style={styles.pauseButton}>
          <Pause color={COLORS.TEXT} size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  pauseButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
});

export default GameUI;
