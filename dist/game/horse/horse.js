import { SERVER_TICK_RATE_MS } from "../../config/globalsettings.js";
export const LOW_SPEED_BOUNDS = [400, 450];
export const MID_SPEED_BOUNDS = [600, 650];
export const HIGH_SPEED_BOUNDS = [800, 900];
export const ACCELERATION_BOUNDS = [400, 440];
export const STAMINA_BOUNDS = [180, 220];
export const STAMINA_THRESHOLD = 500;
export const DECELERATION = 12;
export const MODE_DURATION = 4000;
export const TRIP_LOW_SPEED = 500;
export const TRIP_HIGH_SPEED = 1200;
export const TRIP_PROBABILITY = (SERVER_TICK_RATE_MS / (1000 * 10));
export const TRIP_DURATION_MS = 1000;
function interpolate(specStatValue, bounds) {
    const normalized = (specStatValue - 3) / 17;
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]));
}
export class InternalHorse {
    spec;
    highSpeed;
    midSpeed;
    lowSpeed;
    stamina;
    acceleration;
    constructor(horseSpec) {
        this.spec = horseSpec;
        this.highSpeed = interpolate(horseSpec.stats.topSpeed, HIGH_SPEED_BOUNDS);
        this.midSpeed = interpolate(horseSpec.stats.topSpeed, MID_SPEED_BOUNDS);
        this.lowSpeed = interpolate(horseSpec.stats.topSpeed, LOW_SPEED_BOUNDS);
        this.acceleration = interpolate(horseSpec.stats.acceleration, ACCELERATION_BOUNDS);
        this.stamina = interpolate(horseSpec.stats.stamina, STAMINA_BOUNDS);
    }
}
