import { Types } from "mongoose";
import { IHorse } from "../../models/Horse.js";

export const SPEED_BOUNDS = [50, 100]
export const ACCELERATION_BOUNDS = [1,5]
export const STAMINA_BOUNDS = [500, 600]

function interpolate(specStatValue: number, bounds: Array<number>): number {
    const normalized = (specStatValue - 3)/17
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]))
}

export class InternalHorse {
    spec: IHorse & { _id: Types.ObjectId }

    topSpeed: number;
    stamina: number;
    acceleration: number;

    constructor(horseSpec: IHorse & { _id: Types.ObjectId }) {
        this.spec = horseSpec

        this.topSpeed = interpolate(horseSpec.stats.topSpeed, SPEED_BOUNDS)
        this.acceleration = interpolate(horseSpec.stats.acceleration, ACCELERATION_BOUNDS)
        this.stamina = interpolate(horseSpec.stats.stamina, STAMINA_BOUNDS)
    }
}
