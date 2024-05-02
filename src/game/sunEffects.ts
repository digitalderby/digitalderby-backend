import { Race } from "./race.js"
import { WeatherEffect } from "./weatherEffects.js"

export class Sunny implements WeatherEffect {
    name = 'Sunny'
    effect(race: Race) {
        race.staminaDrainFactor = 1.2
    }
}
