import { TRIP_PROBABILITY } from "./horse/horse.js";
export class Rain {
    name = 'Rain';
    effect(race) {
        race.tripProbability = TRIP_PROBABILITY * 3;
    }
}
