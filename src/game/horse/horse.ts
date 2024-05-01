import { HorseSpec, } from "../../models/Horse.js";

export const LOW_SPEED_BOUNDS = [400, 450]
export const MID_SPEED_BOUNDS = [600, 650]
export const HIGH_SPEED_BOUNDS = [800, 900]
export const ACCELERATION_BOUNDS = [400,440]
export const STAMINA_BOUNDS = [200, 220]

export const DECELERATION = 12
export const MODE_DURATION = 4000

function interpolate(specStatValue: number, bounds: Array<number>): number {
    const normalized = (specStatValue - 3)/17
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]))
}

export class InternalHorse {
    spec: HorseSpec

    highSpeed: number;
    midSpeed: number;
    lowSpeed: number;
    stamina: number;
    acceleration: number;

    constructor(horseSpec: HorseSpec) {
        this.spec = horseSpec

        this.highSpeed = interpolate(horseSpec.stats.topSpeed, HIGH_SPEED_BOUNDS)
        this.midSpeed = interpolate(horseSpec.stats.topSpeed, MID_SPEED_BOUNDS)
        this.lowSpeed = interpolate(horseSpec.stats.topSpeed, LOW_SPEED_BOUNDS)
        this.acceleration = interpolate(horseSpec.stats.acceleration, ACCELERATION_BOUNDS)
        this.stamina = interpolate(horseSpec.stats.stamina, STAMINA_BOUNDS)
    }
}
