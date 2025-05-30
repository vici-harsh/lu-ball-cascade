import React from 'react';
import { StyleSheet, View } from 'react-native';
import GameEngine from './game/GameEngine';

export default function App() {
  return (
    <View style={styles.container}>
      <GameEngine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});