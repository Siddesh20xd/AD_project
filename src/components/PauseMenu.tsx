import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface PauseMenuProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        <Text style={styles.title}>PAUSED</Text>
        <TouchableOpacity style={styles.button} onPress={onResume}>
          <Text style={styles.buttonText}>Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.quitButton]} onPress={onQuit}>
          <Text style={styles.buttonText}>Quit</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  menu: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 250,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 180,
  },
  quitButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PauseMenu;
