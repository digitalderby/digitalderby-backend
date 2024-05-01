// Define the Horse interface
interface Horse {
  id: number;
  topSpeed: number;
  stamina: number;
  acceleration: number;
}

// Configuration for the rain impact on horse attributes
interface RainEffectConfig {
  speedImpactFactor: number;
  staminaImpactFactor: number;
  accelerationImpactFactor: number;
}

// Impact factors indicating how much each attribute is affected by rain
const rainImpactConfig: RainEffectConfig = {
  speedImpactFactor: 0.90, // Reduces speed by 10%
  staminaImpactFactor: 0.95, // Reduces stamina by 5%
  accelerationImpactFactor: 0.85, // Reduces acceleration by 15%
};

/**
* Applies rain effects to all horses in the array.
* 
* @param horses - Array of horse objects.
* @param isRaining - Boolean indicating if it is currently raining.
*/
function applyRainEffectToAllHorses(horses: Horse[], isRaining: boolean): void {
  if (isRaining && horses.length > 0) {
    horses.forEach(horse => {
      // Apply rain effects to each horse
      horse.topSpeed = Math.floor(horse.topSpeed * rainImpactConfig.speedImpactFactor);
      horse.stamina = Math.floor(horse.stamina * rainImpactConfig.staminaImpactFactor);
      horse.acceleration = Math.floor(horse.acceleration * rainImpactConfig.accelerationImpactFactor);

      console.log(`Rain effects applied to Horse ID ${horse.id}: 
      New Top Speed: ${horse.topSpeed}, 
      New Stamina: ${horse.stamina}, 
      New Acceleration: ${horse.acceleration}`);
    });
  }
}

export { applyRainEffectToAllHorses };
