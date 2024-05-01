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
* Applies rain effects to a randomly selected horse from an array.
* 
* @param horses - Array of horse objects.
* @param isRaining - Boolean indicating if it is currently raining.
*/
function applyRainEffectToRandomHorse(horses: Horse[], isRaining: boolean): void {
  if (isRaining && horses.length > 0) {
      // Randomly select one horse to affect
      const randomIndex = Math.floor(Math.random() * horses.length);
      const selectedHorse = horses[randomIndex];

      // Apply rain effects to the selected horse
      selectedHorse.topSpeed = Math.floor(selectedHorse.topSpeed * rainImpactConfig.speedImpactFactor);
      selectedHorse.stamina = Math.floor(selectedHorse.stamina * rainImpactConfig.staminaImpactFactor);
      selectedHorse.acceleration = Math.floor(selectedHorse.acceleration * rainImpactConfig.accelerationImpactFactor);

      console.log(`Rain effects applied to Horse ID ${selectedHorse.id}: 
      New Top Speed: ${selectedHorse.topSpeed}, 
      New Stamina: ${selectedHorse.stamina}, 
      New Acceleration: ${selectedHorse.acceleration}`);
  }
}

export { applyRainEffectToRandomHorse };
