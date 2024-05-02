export const SPEED_BOUNDS = [50, 100];
export const ACCELERATION_BOUNDS = [1, 5];
export const STAMINA_BOUNDS = [500, 600];
function interpolate(specStatValue, bounds) {
    const normalized = (specStatValue - 3) / 17;
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]));
}
export class InternalHorse {
    spec;
    topSpeed;
    stamina;
    acceleration;
    constructor(horseSpec) {
        this.spec = horseSpec;
        this.topSpeed = interpolate(horseSpec.stats.topSpeed, SPEED_BOUNDS);
        this.acceleration = interpolate(horseSpec.stats.acceleration, ACCELERATION_BOUNDS);
        this.stamina = interpolate(horseSpec.stats.stamina, STAMINA_BOUNDS);
    }
}
