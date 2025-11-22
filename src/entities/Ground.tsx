import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';

interface GroundProps {
  body: {
    position: { x: number; y: number };
  };
}

const Ground: React.FC<GroundProps> = ({ body }) => {
  const { position } = body;

  return (
    <View
      style={[
        styles.ground,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {/* Replace with ground texture/pattern image */}
      <View style={styles.groundBody} />
    </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    position: 'absolute',
    width: CONSTANTS.SCREEN_WIDTH * 2,
    height: CONSTANTS.GROUND_HEIGHT,
  },
  groundBody: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.GROUND,
  },
});

export default Ground;
