import { RACE_LENGTH } from "../config/globalsettings.js";
import { TRIP_PROBABILITY } from "./horse/horse.js";
import { rollForWeatherEffect } from "./weatherEffects.js";
export class Race {
    horses;
    length;
    tripProbability = TRIP_PROBABILITY;
    staminaDrainFactor = 1;
    weatherConditions = null;
    constructor(horses) {
        this.horses = horses;
        this.length = RACE_LENGTH;
        this.weatherConditions = rollForWeatherEffect();
    }
}
