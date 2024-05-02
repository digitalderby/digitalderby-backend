import { weightedRandom } from "../random/random.js";
import { Race } from "./race.js";
import { Rain } from "./rainEffects.js";
import { Sunny } from "./sunEffects.js";

export interface WeatherEffect {
    name: string,
    effect: (race: Race) => void
}

const weights = [
    { value: null, weight: 90 },
    { value: new Rain(), weight: 5 },
    { value: new Sunny(), weight: 5 },
]

export function rollForWeatherEffect(): WeatherEffect | null {
    return weightedRandom(weights)
}
