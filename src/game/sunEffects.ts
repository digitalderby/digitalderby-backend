interface Horse {
  id: number;
  topSpeed: number;
  stamina: number;
  acceleration: number;
}

// Configuration for the sun's impact on horse attributes
interface SunEffectConfig {
  staminaImpactFactor: number; // Factor to decrease stamina
}

// Impact factor indicating how much stamina is affected by the sun
const sunEffectConfig: SunEffectConfig = {
  staminaImpactFactor: 0.85, // Reduces stamina by 15%
};

/**
 * Applies sun effects to all horses in the array.
 *
 * @param horses - Array of horse objects.
 * @param isSunny - Boolean indicating if it is currently sunny.
 */
function applySunEffectToAllHorses(horses: Horse[], isSunny: boolean): void {
  if (isSunny && horses.length > 0) {
    horses.forEach((horse) => {
      // Apply sun effects to each horse
      horse.stamina = Math.floor(
        horse.stamina * sunEffectConfig.staminaImpactFactor
      );

      console.log(`Sun effects applied to Horse ID ${horse.id}: 
      New Stamina: ${horse.stamina}`);
    });
  }
}

export { applySunEffectToAllHorses };
