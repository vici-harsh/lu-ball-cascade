import React from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { GAME_CONSTANTS } from '../game/constants';

const { width: screenWidth } = Dimensions.get('window');

export default function Bucket({ position }) {
  return (
    <View
      style={[
        styles.container,
        {
          left: position * screenWidth - GAME_CONSTANTS.BUCKET_WIDTH/2,
        },
      ]}
    >
      <Image 
        source={GAME_CONSTANTS.ASSETS.BUCKET} 
        style={styles.bucket}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: GAME_CONSTANTS.BUCKET_WIDTH,
    height: GAME_CONSTANTS.BUCKET_HEIGHT,
  },
  bucket: {
    width: '100%',
    height: '100%',
  },
});