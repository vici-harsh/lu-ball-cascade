import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';

export default function Ball({ x, y, size }) {
  const randomIndex = Math.floor(Math.random() * GAME_CONSTANTS.ASSETS.BALLS.length);
  const ballImage = GAME_CONSTANTS.ASSETS.BALLS[randomIndex];
  
  return (
    <View
      style={[
        styles.container,
        {
          left: x - size,
          top: y - size,
          width: size * 2,
          height: size * 2,
        },
      ]}
    >
      <Image 
        source={ballImage} 
        style={styles.ball}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  ball: {
    width: '100%',
    height: '100%',
  },
});