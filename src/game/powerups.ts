// powerups.ts
import { InternalHorse } from './horse/horse.js';
import { Race } from './race.js';

export interface Powerup {
  name: string;
  apply(horse: InternalHorse, race: Race): void;
}

export class SpeedBoost implements Powerup {
  name = 'Speed Boost';
  apply(horse: InternalHorse, race: Race) {
    horse.speed += 5;  // Temporarily increase horse speed
  }
}

export class StaminaBoost implements Powerup {
  name = 'Stamina Boost';
  apply(horse: InternalHorse, race: Race) {
    horse.stamina += 10;  // Temporarily increase horse stamina
  }
}

export class TripResistant implements Powerup {
  name = 'Trip Resistant';
  apply(horse: InternalHorse, race: Race) {
    horse.tripProbability *= 0.5;  // Reduce the chance of tripping
  }
}
