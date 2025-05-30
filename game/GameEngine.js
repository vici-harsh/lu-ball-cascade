import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { Audio } from 'expo-av';
import Ball from '../components/Ball';
import Bucket from '../components/Bucket';
import Particles from '../components/Particles';
import Background from '../components/Background';
import { GAME_CONSTANTS } from './constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameEngine() {
  const [state, setState] = useState({
    balls: [],
    particles: [],
    bucketPosition: 0.5,
    score: 0,
    lives: GAME_CONSTANTS.LIVES,
    level: 1,
    gameActive: true,
  });

  const gameLoopRef = useRef();
  const spawnTimerRef = useRef();
  const soundRefs = useRef({
    collect: null,
    pop: null,
    gameOver: null,
    swoosh: null
  });
  const lastSpawnTime = useRef(0);
  const spawnIntervalRef = useRef(GAME_CONSTANTS.SPAWN_INTERVAL);
  const gameActiveRef = useRef(true);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        soundRefs.current.collect = new Audio.Sound();
        await soundRefs.current.collect.loadAsync(GAME_CONSTANTS.ASSETS.SOUNDS.COLLECT);
        
        soundRefs.current.pop = new Audio.Sound();
        await soundRefs.current.pop.loadAsync(GAME_CONSTANTS.ASSETS.SOUNDS.POP);
        
        soundRefs.current.gameOver = new Audio.Sound();
        await soundRefs.current.gameOver.loadAsync(GAME_CONSTANTS.ASSETS.SOUNDS.GAME_OVER);
        
        soundRefs.current.swoosh = new Audio.Sound();
        await soundRefs.current.swoosh.loadAsync(GAME_CONSTANTS.ASSETS.SOUNDS.SPACE_SWOOSH);
        
        console.log("All sounds loaded successfully");
      } catch (error) {
        console.error("Sound loading error:", error);
      }
    };

    loadSounds();

    return () => {
      Object.values(soundRefs.current).forEach(sound => {
        if (sound) sound.unloadAsync();
      });
    };
  }, []);

  useEffect(() => {
    if (state.gameActive) {
      startGame();
    } else {
      stopGame();
    }

    return () => {
      stopGame();
    };
  }, [state.gameActive]);

  const startGame = () => {
    spawnIntervalRef.current = GAME_CONSTANTS.SPAWN_INTERVAL;
    gameActiveRef.current = true;
    
    stopGame(); // Clear any existing intervals
    
    gameLoopRef.current = setInterval(updateGame, 16);
    spawnTimerRef.current = setInterval(spawnBall, spawnIntervalRef.current);
  };

  const stopGame = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  };

  const spawnBall = () => {
    if (!gameActiveRef.current) return;
    
    const ballSize = GAME_CONSTANTS.BALL_MIN_SIZE + 
      Math.random() * (GAME_CONSTANTS.BALL_MAX_SIZE - GAME_CONSTANTS.BALL_MIN_SIZE);
    
    const now = Date.now();
    
    if (now - lastSpawnTime.current < 300) return;
    lastSpawnTime.current = now;
    
    setState(prev => ({
      ...prev,
      balls: [
        ...prev.balls,
        {
          x: Math.random() * (screenWidth - ballSize * 2) + ballSize,
          y: -ballSize,
          size: ballSize,
          speed: GAME_CONSTANTS.BALL_SPEED_BASE + (prev.level - 1) * 0.2,
          rotation: 0,
          rotationSpeed: Math.random() * 2 - 1,
          id: Date.now() + Math.random(),
        }
      ]
    }));
  };

  const updateGame = () => {
    if (!state.gameActive) return;

    setState(prev => {
      let updatedBalls = [];
      let newScore = prev.score;
      let newLives = prev.lives;
      let newLevel = prev.level;
      let gameActive = prev.gameActive;

      for (const ball of prev.balls) {
        const newY = ball.y + ball.speed;
        const bucketX = prev.bucketPosition * screenWidth;
        const ballInBucketX = ball.x > bucketX - GAME_CONSTANTS.BUCKET_WIDTH/2 && 
                            ball.x < bucketX + GAME_CONSTANTS.BUCKET_WIDTH/2;
        
        if (newY > screenHeight - GAME_CONSTANTS.BUCKET_HEIGHT - ball.size && ballInBucketX) {
          // Ball caught - play sound
          if (soundRefs.current.collect) {
            soundRefs.current.collect.replayAsync()
              .catch(error => console.log("Collect sound error:", error));
          }
          
          newScore += GAME_CONSTANTS.SCORE_PER_BALL;
          if (newScore % GAME_CONSTANTS.LEVEL_UP_THRESHOLD === 0) {
            newLevel++;
            
            // Play level up sound
            if (soundRefs.current.swoosh) {
              soundRefs.current.swoosh.replayAsync()
                .catch(error => console.log("Swoosh sound error:", error));
            }
            
            // Increase difficulty
            spawnIntervalRef.current = Math.max(
              300,
              GAME_CONSTANTS.SPAWN_INTERVAL - (newLevel * 50)
            );
            
            if (spawnTimerRef.current) {
              clearInterval(spawnTimerRef.current);
              spawnTimerRef.current = setInterval(spawnBall, spawnIntervalRef.current);
            }
          }
        } else if (newY < screenHeight + ball.size) {
          // Keep ball in play
          updatedBalls.push({
            ...ball,
            y: newY,
            rotation: ball.rotation + ball.rotationSpeed
          });
        } else {
          // Ball missed - play sound
          if (soundRefs.current.pop) {
            soundRefs.current.pop.replayAsync()
              .catch(error => console.log("Pop sound error:", error));
          }
          
          newLives--;
          if (newLives <= 0) {
            gameActive = false;
            gameActiveRef.current = false;
            stopGame();
            
            // Play game over sound
            if (soundRefs.current.gameOver) {
              soundRefs.current.gameOver.replayAsync()
                .catch(error => console.log("Game over sound error:", error));
            }
          }
        }
      }
      
      return {
        ...prev,
        balls: updatedBalls,
        score: newScore,
        lives: newLives,
        level: newLevel,
        gameActive
      };
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newBucketPosition = Math.max(
          0.1,
          Math.min(0.9, gestureState.moveX / screenWidth)
        );
        setState(prev => ({
          ...prev,
          bucketPosition: newBucketPosition,
        }));
      },
    })
  ).current;

  const restartGame = () => {
    stopGame();

    lastSpawnTime.current = 0;
    spawnIntervalRef.current = GAME_CONSTANTS.SPAWN_INTERVAL;
    gameActiveRef.current = true;

    setState({
      balls: [],
      particles: [],
      bucketPosition: 0.5,
      score: 0,
      lives: GAME_CONSTANTS.LIVES,
      level: 1,
      gameActive: true,
    });
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Background />
      {state.balls.map(ball => (
        <Ball key={ball.id} {...ball} />
      ))}
      <Particles particles={state.particles} />
      <Bucket position={state.bucketPosition} />
      
      <View style={styles.uiContainer}>
        <Text style={styles.uiText}>Score: {state.score}</Text>
        <Text style={styles.uiText}>Lives: {state.lives}</Text>
        <Text style={styles.levelText}>Level: {state.level}</Text>
      </View>
      
      {!state.gameActive && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScoreText}>Final Score: {state.score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uiContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  uiText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  levelText: {
    fontSize: 20,
    color: 'yellow',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'white',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 36,
    color: 'white',
    marginBottom: 10,
  },
  highScoreText: {
    fontSize: 30,
    color: 'gold',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  restartButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  restartButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});