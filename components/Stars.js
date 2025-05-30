import React from 'react';
import { View, StyleSheet } from 'react-native';

const STAR_COUNT = 100;

export default function Stars() {
  const stars = Array(STAR_COUNT).fill(0).map((_, i) => {
    const size = Math.random() * 2 + 1;
    return {
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size,
      opacity: Math.random() * 0.8 + 0.2,
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {stars.map(star => (
        <View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: 'white',
  },
});