import { RACE_LENGTH } from "../config/globalsettings.js";
import { InternalHorse, TRIP_PROBABILITY } from "./horse/horse.js";

export class Race {
    horses: Array<InternalHorse>
    length: number

    tripProbability = TRIP_PROBABILITY

    constructor(horses: Array<InternalHorse>) {
        this.horses = horses 
        this.length = RACE_LENGTH
    }
}
