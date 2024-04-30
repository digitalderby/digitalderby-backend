import { Horse, HorseSpec, generateNewHorses } from "../../models/Horse.js";
import { randomIndicesNoReplacement } from "../../random/random.js";
import { Race } from "../race.js";
import { InternalHorse } from "./horse.js";

export const HORSE_POPULATION = 100
export const HORSES_PER_RACE = 4

/** Collection of horses in memory for the game server to access and manipulate */
export let localHorses: InternalHorse[] = []

export async function loadHorsesFromDatabase() {
    console.log('Loading horses from database...')
    const horseSpecs = await Horse.find()

    if (horseSpecs.length !== HORSE_POPULATION) {
        console.log('Not enough horses in database; regenerating them.')

        // Delete all horses already in the database first
        await Horse.deleteMany({})

        let horses = generateNewHorses()
            .map((h) => new Horse(h))

        generateLocalHorsesFromSpecs(horses)

        await Promise.all(horses.map((hm) => hm.save()))


        console.log('Loading successful')
        return
    }

    localHorses = horseSpecs.map((hs) => new InternalHorse(hs))
    console.log('Loading successful')
}

/**
 * Populates the local horse collection with horses from the given array of
 * horse specs.
 *
 * @param {IHorse[]} horseSpecs - Array of horse specs from the database
 */
export function generateLocalHorsesFromSpecs(horseSpecs: HorseSpec[]) {
    console.log('Recreating local horse collection')
    localHorses = horseSpecs.map((hs) => new InternalHorse(hs))
    console.log('Finished recreating local horse collection')
}

export function createRace(): Race | null {
    console.log('creating race')
    let indices = randomIndicesNoReplacement(HORSE_POPULATION, HORSES_PER_RACE)
    if (indices === null) { return null }
    const race = new Race(indices.map((i) => localHorses[i]))
    console.log('created race')
    return race
}

await loadHorsesFromDatabase()
