import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CONSTANTS } from '../utils/constants';

interface BackgroundLayerProps {
  body: {
    position: { x: number; y: number };
    layer: number;
  };
}

const ParallaxBackground: React.FC<BackgroundLayerProps> = ({ body }) => {
  const { position, layer } = body;

  const getLayerStyle = () => {
    switch (layer) {
      case 1:
        return styles.layer1;
      case 2:
        return styles.layer2;
      case 3:
        return styles.layer3;
      default:
        return styles.layer1;
    }
  };

  return (
    <View
      style={[
        styles.layer,
        getLayerStyle(),
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {/* Replace with parallax background images (mountains, trees, clouds) */}
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    width: CONSTANTS.SCREEN_WIDTH * 2,
    height: CONSTANTS.SCREEN_HEIGHT,
  },
  layer1: {
    backgroundColor: 'rgba(135, 206, 250, 0.3)',
  },
  layer2: {
    backgroundColor: 'rgba(135, 206, 250, 0.5)',
  },
  layer3: {
    backgroundColor: 'rgba(135, 206, 250, 0.7)',
  },
});

export default ParallaxBackground;
