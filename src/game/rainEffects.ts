import { TRIP_PROBABILITY } from './horse/horse.js';
import { Race } from './race.js';
import { WeatherEffect } from './weatherEffects.js';

export class Rain implements WeatherEffect {
  name = 'Rain';
  effect(race: Race) {
    race.tripProbability = TRIP_PROBABILITY * 3;
  }
}
