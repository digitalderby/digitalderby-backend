import { RACE_LENGTH } from '../config/globalsettings.js';
import { InternalHorse, TRIP_PROBABILITY } from './horse/horse.js';
import { WeatherEffect, rollForWeatherEffect } from './weatherEffects.js';

export class Race {
  horses: Array<InternalHorse>;
  length: number;

  tripProbability = TRIP_PROBABILITY;
  staminaDrainFactor = 1;

  weatherConditions: WeatherEffect | null = null;

  constructor(horses: Array<InternalHorse>) {
    this.horses = horses;
    this.length = RACE_LENGTH;

    this.weatherConditions = rollForWeatherEffect();
  }
}
