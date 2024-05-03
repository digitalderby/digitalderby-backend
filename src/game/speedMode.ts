import { SERVER_TICK_RATE_MS } from '../config/globalsettings.js';
import { MODE_DURATION } from './horse/horse.js';

const lowPlacementFactors = [1, 0.75, 0.5, 0.25];

const highPlacementFactors = [0.25, 0.5, 0.75, 1];

type SpeedFactor = {
  staminaPercent: number;
  placement: number;
  positionPercent: number;
};

function lowSpeedProb(factor: SpeedFactor): number {
  const staminaFactor =
    factor.staminaPercent < 0.2
      ? 0.5 + ((0.2 - factor.staminaPercent) / 0.2) * 0.5
      : 0;
  const placementFactor = lowPlacementFactors[factor.placement];
  const timeFactor = SERVER_TICK_RATE_MS / (1000 * 4);
  return staminaFactor * placementFactor * timeFactor;
}

function highSpeedProb(factor: SpeedFactor): number {
  const staminaFactor =
    factor.staminaPercent > 0.5
      ? 0.5 + ((factor.staminaPercent - 0.5) / 0.5) * 0.5
      : 0.25;
  const placementFactor = highPlacementFactors[factor.placement];
  const timeFactor = SERVER_TICK_RATE_MS / (1000 * 4);
  return staminaFactor * placementFactor * timeFactor;
}

export function rollForModeBuff(factor: SpeedFactor): {
  mode: 'low' | 'high';
  duration: number;
} | null {
  const lowProb = lowSpeedProb(factor);
  const highProb = highSpeedProb(factor);
  if (Math.random() < lowProb) {
    return {
      mode: 'low',
      duration: MODE_DURATION,
    };
  } else if (Math.random() < highProb) {
    return {
      mode: 'high',
      duration: MODE_DURATION * (0.5 + Math.random() * 1.5),
    };
  }
  return null;
}
