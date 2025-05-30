// components/Particles.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Particles({ particles }) {
  return (
    <>
      {particles.map((particle, index) => (
        <View
          key={index}
          style={[
            styles.particle,
            {
              left: particle.x - particle.size,
              top: particle.y - particle.size,
              width: particle.size * 2,
              height: particle.size * 2,
              borderRadius: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              transform: [{ scale: particle.life }],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});