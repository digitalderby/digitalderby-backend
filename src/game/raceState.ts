import {
  HORSES_PER_RACE,
  RACE_LENGTH,
  SERVER_TICK_RATE_MS,
} from '../config/globalsettings.js';
import {
  DECELERATION,
  InternalHorse,
  MODE_DURATION,
  STAMINA_THRESHOLD,
  TRIP_DURATION_MS,
  TRIP_HIGH_SPEED,
  TRIP_LOW_SPEED,
  TRIP_PROBABILITY,
} from './horse/horse.js';
import { Race } from './race.js';
import { rollForModeBuff } from './speedMode.js';

const dt = SERVER_TICK_RATE_MS / 1000;

export type StatusEffect = {
  name: string;
  duration: number;
};

function placementName(placement: number): string {
  const place = placement + 1;
  switch (place % 10) {
    case 1:
      return `${place}st`;
    case 2:
      return `${place}nd`;
    case 3:
    default:
      return `${place}th`;
  }
}

export class RaceState {
  horseStates: Array<HorseState> = [];
  rankings: Array<number> = [];
  time: number = 0;
  length: number = RACE_LENGTH;
  newMessages: string[] = [];

  constructor(race?: Race) {
    if (race) {
      this.horseStates = race.horses.map((h) => new HorseState(h));
      this.rankings = Array.from(
        { length: this.horseStates.length },
        (_, i) => i,
      );
    }
  }

  nextState(race: Race): RaceState {
    const next = new RaceState();

    const queuedStatusEffects: {
      status: StatusEffect;
      horseIdx: number;
    }[] = [];

    const newFinishes: number[] = [];

    next.time = this.time + SERVER_TICK_RATE_MS;
    // Perform movement/stamina updates for the horse state.
    next.horseStates = this.horseStates.map((hs, horseIdx) => {
      if (hs.finishTime !== null) {
        return hs;
      }
      const nextHs = new HorseState(hs.horse);

      const staminaPercent = hs.currentStamina / hs.horse.stamina;
      const currentPlacement = this.placement(horseIdx);
      const positionPercent = hs.position / RACE_LENGTH;

      // Tick down status effects.
      for (const status of hs.statusEffects) {
        if (status.duration >= 0) {
          nextHs.statusEffects.push({
            name: status.name,
            duration: status.duration - SERVER_TICK_RATE_MS,
          });
        }
      }

      const trip = hs.hasStatus('trip');

      // Calculate modifiers based on current stats.

      let targetSpeed =
        hs.speedMode === 'high'
          ? hs.horse.highSpeed
          : hs.speedMode === 'mid'
            ? hs.horse.midSpeed
            : hs.horse.lowSpeed;

      // If the horse tripped, set target speed to 0.
      if (trip) {
        targetSpeed = 0;
      }

      // Move position by currentSpeed
      nextHs.position = hs.position + hs.currentSpeed * dt;

      // If the horse reaches the end, set their finish time
      if (nextHs.position >= RACE_LENGTH) {
        nextHs.position = RACE_LENGTH;
        nextHs.finishTime = next.time;
        newFinishes.push(horseIdx);
      }

      // Decelerate if we are faster than the target speed
      if (nextHs.currentSpeed > targetSpeed) {
        nextHs.currentSpeed = Math.max(
          hs.currentSpeed - DECELERATION * dt,
          targetSpeed,
        );
      }

      // Accelerate if we are behind the target speed
      const accelMultiplier = hs.speedMode === 'high' ? 2 : 1;
      nextHs.currentSpeed = Math.min(
        hs.currentSpeed + accelMultiplier * hs.horse.acceleration * dt,
        targetSpeed,
      );

      // If speed is below the stamina threshold, replenish stamina,
      // otherwise drain it.
      // If going slow, you will always recover 12.5% stamina per second.
      // If going fast, stamina consumption increases.
      let staminaChange = STAMINA_THRESHOLD - hs.currentSpeed;

      if (hs.speedMode === 'low') {
        staminaChange = Math.max(staminaChange, hs.horse.stamina / 8);
      } else if (hs.speedMode === 'high') {
        staminaChange += 200;
      }

      staminaChange *= dt;

      if (staminaChange < 0) {
        staminaChange *= race.staminaDrainFactor;
      }

      nextHs.currentStamina = Math.min(
        hs.horse.stamina,
        Math.max(0, hs.currentStamina + staminaChange),
      );

      // If the horse is currently deciding to go at 'low' or 'high'
      // speed for a time, decrease the buff duration
      if (hs.modeBuff !== null && hs.modeBuff.duration > 0) {
        nextHs.modeBuff = {
          mode: hs.modeBuff.mode,
          duration: hs.modeBuff.duration - SERVER_TICK_RATE_MS,
        };
        // If out of stamina, enter 'low' mode
      } else if (nextHs.currentStamina <= 0) {
        nextHs.modeBuff = {
          mode: 'low',
          duration: MODE_DURATION,
        };
      } else {
        const factor = {
          staminaPercent: staminaPercent,
          placement: currentPlacement,
          positionPercent: positionPercent,
        };
        nextHs.modeBuff = rollForModeBuff(factor);
      }
      // If there is no active buff, horse is moving at 'mid' speed-
      // otherwise, at the speed defined by the mode buff
      nextHs.speedMode =
        nextHs.modeBuff === null ? 'mid' : nextHs.modeBuff.mode;

      // If the horse hasn't tripped, every tick add a mild probability
      // the horse trips.
      const tripFactor =
        (hs.currentSpeed - TRIP_LOW_SPEED) / (TRIP_HIGH_SPEED - TRIP_LOW_SPEED);
      if (!trip && Math.random() < tripFactor * race.tripProbability) {
        queuedStatusEffects.push({
          horseIdx: horseIdx,
          status: {
            name: 'trip',
            duration: TRIP_DURATION_MS,
          },
        });
      }

      return nextHs;
    });

    // Apply all finish commentaries
    for (const horseIdx of newFinishes) {
      next.finishCommentary(horseIdx);
    }

    // Apply all queued status effects to the horses
    for (const { horseIdx, status } of queuedStatusEffects) {
      next.horseStates[horseIdx].statusEffects.push(status);

      next.horseStatusCommentary(horseIdx, status);
    }

    next.rankings = Array.from(
      { length: this.horseStates.length },
      (_, i) => i,
    );
    next.recomputeRankings();

    next.positionChangeCommentary(this);

    return next;
  }

  recomputeRankings() {
    this.rankings.sort((idxI, idxJ) => {
      const horseI = this.horseStates[idxI];
      const horseJ = this.horseStates[idxJ];
      if (horseI.finishTime !== null && horseJ.finishTime !== null) {
        if (Math.abs(horseI.finishTime - horseJ.finishTime) > 0) {
          return horseI.finishTime - horseJ.finishTime;
        } else {
          return idxI - idxJ;
        }
      } else if (horseI.finishTime !== null) {
        return -1;
      } else if (horseJ.finishTime !== null) {
        return 1;
      } else {
        if (Math.abs(horseI.position - horseJ.position) > 0) {
          return horseJ.position - horseI.position;
        } else {
          return idxI - idxJ;
        }
      }
    });
  }

  positionChangeCommentary(previous: RaceState) {
    // New horse took the lead
    if (previous.rankings[0] !== this.rankings[0]) {
      const horse = this.horseStates[this.rankings[0]].horse;
      this.newMessages.push(`${horse.spec.name} took the lead!`);
    }

    // Horse ascends to new position that isn't first place
    for (let i = 0; i < HORSES_PER_RACE; i++) {
      const prevPlacement = previous.placement(i);
      const currPlacement = this.placement(i);

      if (prevPlacement < currPlacement && currPlacement !== 0) {
        const horse = this.horseStates[i].horse;
        this.newMessages.push(
          `${horse.spec.name} ascends to ${placementName(currPlacement)} place!`,
        );
      }
    }
  }

  horseStatusCommentary(horseIdx: number, status: StatusEffect) {
    const horse = this.horseStates[horseIdx].horse;
    switch (status.name) {
      case 'trip':
        {
          this.newMessages.push(`${horse.spec.name} tripped!`);
        }
        break;
      case 'boost':
        {
          this.newMessages.push(`${horse.spec.name} ate a carrot!`);
        }
        break;
    }
  }

  finishCommentary(horseIdx: number) {
    const placement = this.placement(horseIdx);
    const horse = this.horseStates[horseIdx].horse;
    this.newMessages.push(`${horse.spec.name} finished in ${placement} place!`);
  }

  placement(horseIdx: number): number {
    return this.rankings.findIndex((idx) => horseIdx === idx);
  }

  raceOver() {
    return this.horseStates.every((hs) => hs.finishTime !== null);
  }
}

export class HorseState {
  horse: InternalHorse;

  position: number = 0;
  currentSpeed: number = 0;
  currentStamina: number = 0;
  finishTime: number | null = null;

  speedMode: 'low' | 'mid' | 'high' = 'mid';
  modeBuff: {
    mode: 'low' | 'high';
    duration: number;
  } | null = null;

  statusEffects: StatusEffect[] = [];

  hasStatus(status: string): boolean {
    return this.statusEffects.find((se) => se.name === status) !== undefined;
  }

  constructor(horse: InternalHorse) {
    this.horse = horse;
    this.currentStamina = horse.stamina;
  }
}
