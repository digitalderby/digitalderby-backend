// powerups.ts
import { InternalHorse } from './horse/horse.js';
import { Race } from './race.js';

// Define a type for the powerup functions
export type Powerup = (horse: InternalHorse, race: Race) => void;

// Speed Boost Powerup
export const applySpeedBoost: Powerup = (horse, race, boostAmount = 5) => {
  horse.highSpeed += boostAmount; // Increase high speed by a fixed amount
  horse.midSpeed += boostAmount * 0.75; // Mid speed increases by a slightly lesser factor
  horse.lowSpeed += boostAmount * 0.5; // Low speed increases by half the factor of high speed
};

// Stamina Boost Powerup
export const applyStaminaBoost: Powerup = (horse, race, boostAmount = 10) => {
  horse.stamina += boostAmount; // Directly increase stamina
};

// Trip Resistant Powerup
export const applyTripResistant: Powerup = (horse, race, resistanceFactor = 0.5) => {
  if ('tripProbability' in horse) { // Check if tripProbability exists in horse
    horse.tripProbability *= resistanceFactor; // Reduce the chance of tripping by a factor
  }
};
