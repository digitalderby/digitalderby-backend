// powerups.ts
import { InternalHorse } from './horse/horse.js';
import { Race } from './race.js';

// Define a type for the powerup functions
export type Powerup = (horse: InternalHorse, race: Race) => void;

// Speed Boost Powerup
export const applySpeedBoost: Powerup = (horse, race, boostAmount = 5) => { // Default boost amount is 5
  horse.highSpeed += boostAmount; // Increase high speed 
  horse.midSpeed += boostAmount * 0.75; // Mid speed increases 
  horse.lowSpeed += boostAmount * 0.5; // Low speed increases 
};

// Stamina Boost Powerup
export const applyStaminaBoost: Powerup = (horse, race, boostAmount = 10) => { // Default boost amount is 10
  horse.stamina += boostAmount; // Directly increase stamina
};