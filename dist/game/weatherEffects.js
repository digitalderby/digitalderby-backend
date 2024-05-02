import { weightedRandom } from "../random/random.js";
import { Rain } from "./rainEffects.js";
import { Sunny } from "./sunEffects.js";
const weights = [
    { value: null, weight: 90 },
    { value: new Rain(), weight: 5 },
    { value: new Sunny(), weight: 5 },
];
export function rollForWeatherEffect() {
    return weightedRandom(weights);
}
