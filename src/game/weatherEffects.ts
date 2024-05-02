import { weightedRandom } from "../random/random.js";
import { TRIP_PROBABILITY } from "./horse/horse.js";
import { Race } from "./race.js";
import { Rain } from "./rainEffects.js";
import { Sunny } from "./sunEffects.js";

export interface WeatherEffect {
    name: string,
    effect: (race: Race) => void
}

const weights = [
    { value: null, weight: 80 },
    { value: new Rain(), weight: 10 },
    { value: new Sunny(), weight: 10 },
]

export function rollForWeatherEffect(): WeatherEffect | null {
    return weightedRandom(weights)
}
