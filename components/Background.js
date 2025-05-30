import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';

export default function Background() {
  // Randomly select a background image
  const randomIndex = Math.floor(Math.random() * GAME_CONSTANTS.ASSETS.BACKGROUNDS.length);
  const backgroundImage = GAME_CONSTANTS.ASSETS.BACKGROUNDS[randomIndex];
  
  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});