import { Horse, IHorse } from "../../models/Horse.js";
import { InternalHorse } from "./horse.js";

/** Collection of horses in memory for the game server to access and manipulate */
export let localHorses: InternalHorse[] = []

export async function loadHorsesFromDatabase() {
    console.log('Loading horses from database...')
    const horseSpecs = await Horse.find()
    localHorses = horseSpecs.map((hs) => new InternalHorse(hs))
    console.log('Loading successful')
}

/**
 * Populates the local horse collection with horses from the given array of
 * horse specs.
 *
 * @param {IHorse[]} horseSpecs - Array of horse specs from the database
 */
export function generateLocalHorsesFromSpecs(horseSpecs: IHorse[]) {
    console.log('Recreating local horse collection')
    localHorses = horseSpecs.map((hs) => new InternalHorse(hs))
    console.log('Finished recreating local horse collection')
}

await loadHorsesFromDatabase()
