export const SERVER_TICK_RATE_MS =
  Number(process.env.SERVER_TICK_RATE_MS) || 100;

export const HORSE_POPULATION = Number(process.env.HORSE_POPULATION) || 100;
export const HORSES_PER_RACE = Number(process.env.HORSES_PER_RACE) || 4;

export const MINIMUM_BET = Number(process.env.MINIMUM_BET) || 10;
export const DEFAULT_WALLET = Number(process.env.DEFAULT_WALLET) || 100;
export const BETTING_DELAY = Number(process.env.BETTING_DELAY) || 10;
export const PRERACE_DELAY = Number(process.env.PRERACE_DELAY) || 3;
export const RESULTS_DELAY = Number(process.env.RESULTS_DELAY) || 10;

export const CHEAT_MODE = process.env.CHEAT_MODE === 'enabled';
export const RACE_LENGTH = Number(process.env.RACE_LENGTH) || 10000;
export const AUTOSTART = process.env.AUTOSTART === 'enabled';
