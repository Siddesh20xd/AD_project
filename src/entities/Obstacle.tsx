import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';

interface ObstacleProps {
  body: {
    position: { x: number; y: number };
    type: 'stone' | 'log' | 'hole';
  };
}

const Obstacle: React.FC<ObstacleProps> = ({ body }) => {
  const { position, type } = body;

  const getObstacleStyle = () => {
    switch (type) {
      case 'stone':
        return styles.stone;
      case 'log':
        return styles.log;
      case 'hole':
        return styles.hole;
      default:
        return styles.stone;
    }
  };

  return (
    <View
      style={[
        styles.obstacle,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {/* Replace with actual obstacle sprites/images */}
      <View style={[styles.obstacleBody, getObstacleStyle()]} />
    </View>
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    width: CONSTANTS.OBSTACLE_WIDTH,
    height: CONSTANTS.OBSTACLE_HEIGHT,
  },
  obstacleBody: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  stone: {
    backgroundColor: COLORS.OBSTACLE,
  },
  log: {
    backgroundColor: '#8B4513',
  },
  hole: {
    backgroundColor: '#000000',
  },
});

export default Obstacle;
