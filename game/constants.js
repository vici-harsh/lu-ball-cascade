import ball01 from '../assets/images/Balls/01.png';
import ball02 from '../assets/images/Balls/02.png';
import ball03 from '../assets/images/Balls/03.png';
import ball04 from '../assets/images/Balls/04.png';
import ball05 from '../assets/images/Balls/05.png';
import ball06 from '../assets/images/Balls/06.png';
import ball07 from '../assets/images/Balls/07.png';
import ball08 from '../assets/images/Balls/08.png';
import ball09 from '../assets/images/Balls/09.png';
import ball10 from '../assets/images/Balls/10.png';
import ball11 from '../assets/images/Balls/11.png';
import ball12 from '../assets/images/Balls/12.png';
import ball13 from '../assets/images/Balls/13.png';
import ball14 from '../assets/images/Balls/14.png';
import ball15 from '../assets/images/Balls/15.png';
import ball16 from '../assets/images/Balls/16.png';
import ball17 from '../assets/images/Balls/17.png';

import background11 from '../assets/images/background/11.png';

import bucket from '../assets/images/Bucket/bucket.png';

import collectSound from '../assets/sounds/collect.wav';
import gameOverSound from '../assets/sounds/game-over.wav';
import popSound from '../assets/sounds/pop.wav';
import swooshSound from '../assets/sounds/space-swoosh.wav';

export const GAME_CONSTANTS = {
  BALL_MIN_SIZE: 20,
  BALL_MAX_SIZE: 20,
  BUCKET_WIDTH: 180,
  BUCKET_HEIGHT: 80,
  BALL_SPEED_BASE: 1.5,
  SPAWN_INTERVAL: 800,
  LIVES: 5,
  SCORE_PER_BALL: 10,
  LEVEL_UP_THRESHOLD: 100,
  
  ASSETS: {
    BACKGROUNDS: [background11],
    BALLS: [
      ball01, ball02, ball03, ball04, ball05, 
      ball06, ball07, ball08, ball09, ball10,
      ball11, ball12, ball13, ball14, ball15,
      ball16, ball17
    ],
    BUCKET: bucket,
    SOUNDS: {
      COLLECT: collectSound,
      GAME_OVER: gameOverSound,
      POP: popSound,
      SPACE_SWOOSH: swooshSound,
    },
  },
};

export const validateSizes = () => {
  const minBallToBucketRatio = GAME_CONSTANTS.BALL_MIN_SIZE / GAME_CONSTANTS.BUCKET_WIDTH;
  const maxBallToBucketRatio = GAME_CONSTANTS.BALL_MAX_SIZE / GAME_CONSTANTS.BUCKET_WIDTH;
  
  console.log(`Ball to bucket width ratio: ${minBallToBucketRatio.toFixed(2)} - ${maxBallToBucketRatio.toFixed(2)}`);
  
  // Recommended ratio range: 0.15 - 0.35
  if (maxBallToBucketRatio > 0.35) {
    console.warn('Balls are too large compared to bucket!');
  }
  if (minBallToBucketRatio < 0.15) {
    console.warn('Balls are too small compared to bucket!');
  }
};