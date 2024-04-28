import { randomIndicesNoReplacement } from "../random/random.js"
import { Horse } from "./horse/horse.js"
import { Race } from "./race.js"

export const HORSE_POPULATION = 100
export const HORSES_PER_RACE = 4

class GameDatabase {
    horses: Array<Horse> = []

    populate() {
        this.horses = Array.from(
            {length: HORSE_POPULATION},
            (_v, i) => Horse.random(i)
        )
    }

    /** Create a new race by taking a random sample of horses from the population */
    createRace(): Race | null {
        console.log('creating race')
        let indices = randomIndicesNoReplacement(HORSE_POPULATION, HORSES_PER_RACE) 
        if (indices === null) { return null }
        console.log('created race')
        return new Race(indices.map((i) => this.horses[i]))
    }
}

const database = new GameDatabase()

database.populate()

export default database
