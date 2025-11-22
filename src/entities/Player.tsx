import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CONSTANTS, COLORS } from '../utils/constants';

interface PlayerProps {
  body: {
    position: { x: number; y: number };
    velocity: { y: number };
    isJumping: boolean;
    isSliding: boolean;
  };
}

const Player: React.FC<PlayerProps> = ({ body }) => {
  const { position, isSliding } = body;
  const width = CONSTANTS.PLAYER_WIDTH;
  const height = isSliding ? CONSTANTS.PLAYER_HEIGHT / 2 : CONSTANTS.PLAYER_HEIGHT;

  return (
    <View
      style={[
        styles.player,
        {
          left: position.x,
          top: position.y,
          width,
          height,
        },
      ]}
    >
      {/* Replace this View with an animated monkey sprite/image */}
      <View style={styles.playerBody} />
    </View>
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
  },
  playerBody: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.PLAYER,
    borderRadius: 8,
  },
});

export default Player;
