import { randomIndicesNoReplacement } from "../random/random.js";
import { Horse } from "./horse/horse.js";
import { Race } from "./race.js";

const HORSE_POPULATION = 1000;
const HORSES_PER_RACE = 4;

class GameDatabase {
    horses: Array<Horse> = [];

    /** Populate the database with a population of horses */
    populate(): void {
        try {
            this.horses = Array.from(
                { length: HORSE_POPULATION },
                (_v, i) => Horse.random(i)
            );
        } catch (error) {
            console.error("Error populating horses:", error);
        }
    }

    /** Create a new race by taking a random sample of horses from the population */
    createRace(): Race | null {
        console.log('creating race');
        let indices = randomIndicesNoReplacement(HORSE_POPULATION, HORSES_PER_RACE);
        if (indices === null) {
            throw new Error("Failed to generate random indices for race.");
        }
        console.log('created race');
        return new Race(indices.map((i) => this.horses[i]));
    }
}

const database = new GameDatabase();

database.populate();

export default database;
