import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';

interface BananaProps {
  body: {
    position: { x: number; y: number };
    animationOffset: number;
  };
}

const Banana: React.FC<BananaProps> = ({ body }) => {
  const { position, animationOffset } = body;

  return (
    <View
      style={[
        styles.banana,
        {
          left: position.x,
          top: position.y + animationOffset,
        },
      ]}
    >
      {/* Replace with banana sprite/image */}
      <View style={styles.bananaBody} />
    </View>
  );
};

const styles = StyleSheet.create({
  banana: {
    position: 'absolute',
    width: CONSTANTS.BANANA_SIZE,
    height: CONSTANTS.BANANA_SIZE,
  },
  bananaBody: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.BANANA,
    borderRadius: CONSTANTS.BANANA_SIZE / 2,
  },
});

export default Banana;
