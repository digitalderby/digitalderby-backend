import { RACE_LENGTH, SERVER_TICK_RATE_MS } from "../config/globalsettings.js"
import { DECELERATION, InternalHorse, MODE_DURATION, STAMINA_THRESHOLD, TRIP_DURATION_MS, TRIP_HIGH_SPEED, TRIP_LOW_SPEED, TRIP_PROBABILITY } from "./horse/horse.js"
import { Race } from "./race.js"

const dt = SERVER_TICK_RATE_MS/1000

const lowPlacementFactors = [
    1, 0.75, 0.5, 0.25
]

const highPlacementFactors = [
    0.25, 0.5, 0.75, 1
]

type SpeedFactor = {
    staminaPercent: number,
    placement: number,
    positionPercent: number,
}

export type StatusEffect = {
    name: string,
    duration: number,
}

function lowSpeedProb(factor: SpeedFactor): number {
    const staminaFactor =
        (factor.staminaPercent < 0.2)
        ? 0.5 + ((0.2 - factor.staminaPercent)/0.2)*0.5
        : 0
    const placementFactor = lowPlacementFactors[factor.placement]
    const timeFactor = SERVER_TICK_RATE_MS/(1000 * 4)
    return staminaFactor * placementFactor * timeFactor
}

function highSpeedProb(factor: SpeedFactor): number {
    const staminaFactor =
        (factor.staminaPercent > 0.5)
        ? 0.5 + ((factor.staminaPercent - 0.5)/0.5)*0.5
        : 0.25
    const placementFactor = highPlacementFactors[factor.placement]
    const timeFactor = SERVER_TICK_RATE_MS/(1000 * 4)
    return staminaFactor * placementFactor * timeFactor
}

function rollForModeBuff(factor: SpeedFactor): {
    mode: 'low' | 'high', duration: number
} | null {
    const lowProb = lowSpeedProb(factor)
    const highProb = highSpeedProb(factor)
    if (Math.random() < lowProb) {
        return {
            mode: 'low',
            duration: MODE_DURATION,
        }
    } else if (Math.random() < highProb) {
        return {
            mode: 'high',
            duration: MODE_DURATION * (0.5 + Math.random()*1.5)
        }
    }
    return null
}

export class RaceState {
    horseStates: Array<HorseState> = []
    rankings: Array<number> = []
    time: number = 0
    length: number = RACE_LENGTH

    constructor(race?: Race) {
        if (race) {
            this.horseStates = race.horses.map((h) => new HorseState(h))
            this.rankings = Array.from(
                {length: this.horseStates.length},
                (_, i) => i)
        }
    }

    nextState(race: Race): RaceState {
        let next = new RaceState()        
        next.time = this.time + SERVER_TICK_RATE_MS
        next.horseStates = this.horseStates.map((hs, i) => {
            if (hs.finishTime !== null) { return hs }
            let nextHs = new HorseState(hs.horse)

            const staminaPercent = hs.currentStamina / hs.horse.stamina
            const currentPlacement = this.placement(i)
            const positionPercent = hs.position/RACE_LENGTH

            let targetSpeed =
                (hs.speedMode === 'high')
                ? hs.horse.highSpeed
                : (hs.speedMode === 'mid')
                  ? hs.horse.midSpeed
                  : hs.horse.lowSpeed

            // If the horse tripped, set target speed to 0.
            const trip = hs.hasStatus('trip')
            if (trip) {
                targetSpeed = 0
            }

            // Move position by currentSpeed
            nextHs.position = hs.position + hs.currentSpeed*dt

            // If the horse reaches the end, set their finish time
            if (nextHs.position >= RACE_LENGTH) {
                nextHs.position = RACE_LENGTH
                nextHs.finishTime = next.time
            }

            // Decelerate if we are faster than the target speed
            if (nextHs.currentSpeed > targetSpeed) {
                nextHs.currentSpeed =
                    Math.max(hs.currentSpeed - DECELERATION * dt,
                             targetSpeed)
            }

            // Accelerate if we are behind the target speed
            const accelMultiplier = (hs.speedMode === 'high') ? 2 : 1
            nextHs.currentSpeed = 
                Math.min(hs.currentSpeed +
                         accelMultiplier * hs.horse.acceleration * dt,
                         targetSpeed)

            // If speed is below the stamina threshold, replenish stamina,
            // otherwise drain it.
            // If going slow, you will always recover 12.5% stamina per second.
            // If going fast, stamina consumption increases.
            let staminaChange = STAMINA_THRESHOLD - hs.currentSpeed

            if (hs.speedMode === 'low') {
                staminaChange = Math.max(staminaChange, hs.horse.stamina/8)
            } else if (hs.speedMode === 'high') {
                staminaChange += 200
            }

            staminaChange *= dt

            nextHs.currentStamina = 
                Math.min(hs.horse.stamina,
                         Math.max(0, hs.currentStamina + staminaChange))

            // If the horse is currently deciding to go at 'low' or 'high'
            // speed for a time, decrease the buff duration
            if (hs.modeBuff !== null && hs.modeBuff.duration > 0) {
                nextHs.modeBuff = {
                    mode: hs.modeBuff.mode,
                    duration: hs.modeBuff.duration - SERVER_TICK_RATE_MS,
                }
            // If out of stamina, enter 'low' mode
            } else if (nextHs.currentStamina <= 0) {
                nextHs.modeBuff = {
                    mode: 'low',
                    duration: MODE_DURATION,
                }
            } else {
                const factor = {
                    staminaPercent: staminaPercent,
                    placement: currentPlacement,
                    positionPercent: positionPercent,
                }
                nextHs.modeBuff = rollForModeBuff(factor)
            }
            // If there is no active buff, horse is moving at 'mid' speed-
            // otherwise, at the speed defined by the mode buff
            nextHs.speedMode = (nextHs.modeBuff === null) ? 'mid' : nextHs.modeBuff.mode

            // Tick down status effects.
            for (const status of hs.statusEffects) {
                if (status.duration >= 0) {
                    nextHs.statusEffects.push({
                        name: status.name,
                        duration: status.duration - SERVER_TICK_RATE_MS,
                    })
                }
            }

            // If the horse hasn't tripped, every tick add a mild probability
            // the horse trips.
            const tripFactor = (hs.currentSpeed - TRIP_LOW_SPEED)/
                (TRIP_HIGH_SPEED - TRIP_LOW_SPEED)
            console.log(tripFactor * race.tripProbability)
            if (!trip && Math.random() < tripFactor * race.tripProbability) {
                nextHs.statusEffects.push({
                    name: 'trip',
                    duration: TRIP_DURATION_MS,
                })
            }

            return nextHs
        })
        next.rankings = Array.from(
            {length: this.horseStates.length},
            (_, i) => i)
        next.recomputeRankings()
         
        return next
    }

    recomputeRankings() {
        this.rankings.sort((idxI, idxJ) => {
            const horseI = this.horseStates[idxI]
            const horseJ = this.horseStates[idxJ]
            if (horseI.finishTime !== null && horseJ.finishTime !== null) {
                if (Math.abs(horseI.finishTime - horseJ.finishTime) > 0) {
                    return horseI.finishTime - horseJ.finishTime
                } else {
                    return idxI - idxJ
                }
            } else if (horseI.finishTime !== null) {
                return -1
            } else if (horseJ.finishTime !== null) {
                return 1
            } else {
                if (Math.abs(horseI.position - horseJ.position) > 0) {
                    return horseJ.position - horseI.position
                } else {
                    return idxI - idxJ
                }
            }
        })
    }

    placement(horseIdx: number): number {
        return this.rankings.findIndex((idx) => horseIdx === idx)
    }

    raceOver() {
        return this.horseStates.every((hs) => hs.finishTime !== null)
    }
}

export class HorseState {
    horse: InternalHorse 

    position: number = 0
    currentSpeed: number = 0
    currentStamina: number = 0
    finishTime: number | null = null

    speedMode: 'low' | 'mid' | 'high' = 'mid'
    modeBuff: {
        mode: 'low' | 'high',
        duration: number,
    } | null = null

    statusEffects: StatusEffect[] = []

    hasStatus(status: string): boolean {
        return this.statusEffects.find((se) => se.name === status) !== undefined
    }

    constructor(horse: InternalHorse) {
        this.horse = horse
        this.currentStamina = horse.stamina
    }
}
