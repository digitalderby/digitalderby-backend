import { RACE_LENGTH } from "../config/globalsettings.js";
import { InternalHorse } from "./horse/horse.js";

export class Race {
    horses: Array<InternalHorse>
    length: number

    constructor(horses: Array<InternalHorse>) {
        this.horses = horses 
        this.length = RACE_LENGTH
    }
}
