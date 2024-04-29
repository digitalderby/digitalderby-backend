import { InternalHorse } from "./horse/horse.js";

export const RACE_DURATION = 10000

export class Race {
    horses: Array<InternalHorse>;

    constructor(horses: Array<InternalHorse>) {
        this.horses = horses 
    }
}
