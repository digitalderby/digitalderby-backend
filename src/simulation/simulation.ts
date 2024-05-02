import { HORSES_PER_RACE, HORSE_POPULATION } from "../config/globalsettings.js";
import { InternalHorse } from "../game/horse/horse.js";
import { Race } from "../game/race.js";
import { RaceState } from "../game/raceState.js";
import { shuffle } from "../random/random.js";

const ROUNDS = 1000

type Results = {
    index: number,
    placements: number[],
    score: number
}

export function simulation(horses: InternalHorse[]): Results[] {
    console.log('Starting simulation...')
    const indices = Array.from({length: HORSE_POPULATION}, (_v, i) => i)
    let results: Results[] = Array.from({length: HORSE_POPULATION}, (_v, i) => {
        return {
            index: i,
            placements: Array(HORSES_PER_RACE).fill(0),
            score: 0,
        }
    })

    for (let r = 0; r < ROUNDS; r++) {
        console.log('simulation round', r+1)
        shuffle(indices)
        const horseGroups =
            Array.from({length: Math.floor(HORSE_POPULATION/4)},
                (_v, raceNo) => {
                    return indices
                        .slice(raceNo * HORSES_PER_RACE, (raceNo + 1) * HORSES_PER_RACE)
                        .map((horseIdx) => horses[horseIdx])
                })
        const races = horseGroups.map((horses) => new Race(horses))
        let raceStates = races.map((r) => new RaceState(r))

        while(raceStates.some((rs) => !rs.raceOver())) {
            const nextRaceStates = raceStates.map((rs, i) => rs.nextState(races[i]))
            raceStates = nextRaceStates
        }

        for (let j = 0; j < raceStates.length; j++) {
            const rs = raceStates[j]
            for (let horseIdx = 0; horseIdx < HORSES_PER_RACE; horseIdx++) {
                const placement = rs.placement(horseIdx)
                results[indices[j*HORSES_PER_RACE + horseIdx]].placements[rs.placement(horseIdx)] += 1
                results[indices[j*HORSES_PER_RACE + horseIdx]].score += HORSES_PER_RACE - placement
            }
        }
    }

    results.sort((a, b) => a.score - b.score)

    for (let i = 0; i < results.length; i++) {
        const rs = results[i]

        console.log(`${horses[i].spec.name}: ${rs.score} (${rs.placements})`)
        for (const stat of ["topSpeed", "stamina", "acceleration",]) {
            console.log(`${stat}, ${horses[i].spec.stats[stat]}`)
        }

        for (let i = 0; i < HORSES_PER_RACE; i++) {
            const placementPercent = ((rs.placements[i]/ROUNDS)*100).toFixed(2)
            console.log(`placement ${i+1}: ${placementPercent}%`)
        }
    }

    return results
}
