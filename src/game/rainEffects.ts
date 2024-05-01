interface Horse {
  id: number;
  topSpeed: number;
  stamina: number;
  acceleration: number;
  isTripped?: boolean; // Used to indicate if the horse has tripped
}

// Configuration for the rain impact on horse attributes
interface RainEffectConfig {
  speedImpactFactor: number;
  staminaImpactFactor: number;
  accelerationImpactFactor: number;
}

// Impact factors indicating how much each attribute is affected by rain
const rainImpactConfig: RainEffectConfig = {
  speedImpactFactor: 0.9, // Reduces speed by 10%
  staminaImpactFactor: 0.95, // Reduces stamina by 5%
  accelerationImpactFactor: 0.85, // Reduces acceleration by 15%
};

/**
 * Applies rain effects to all horses in the array and randomly causes the fastest horse to trip.
 *
 * @param horses - Array of horse objects.
 * @param isRaining - Boolean indicating if it is currently raining.
 */

// TODO: Change function name to something less literal
function applyRainEffectAndRandomTrip(
  horses: Horse[],
  isRaining: boolean
): void {
  if (horses.length > 0) {
    if (isRaining) {
      horses.forEach((horse) => {
        // Apply rain effects to each horse
        horse.topSpeed = Math.floor(
          horse.topSpeed * rainImpactConfig.speedImpactFactor
        );
        horse.stamina = Math.floor(
          horse.stamina * rainImpactConfig.staminaImpactFactor
        );
        horse.acceleration = Math.floor(
          horse.acceleration * rainImpactConfig.accelerationImpactFactor
        );
      });
    }

    // Determine the fastest horse
    const fastestHorse = horses.reduce(
      (max, horse) => (horse.topSpeed > max.topSpeed ? horse : max),
      horses[0]
    );
    if (Math.random() < 0.1) {   // 10% chance to randomly decide if the fastest horse trips
      fastestHorse.isTripped = true;
      fastestHorse.topSpeed = 0; // Stop the horse for one second
      setTimeout(() => {
        fastestHorse.isTripped = false; // Reset the tripped state
        // Restore the original top speed adjusted for rain
        fastestHorse.topSpeed = Math.floor(
          fastestHorse.topSpeed / rainImpactConfig.speedImpactFactor
        );
      }, 1000);

      console.log(`Horse ID ${fastestHorse.id} tripped.`);
    }
  }
}

export { applyRainEffectAndRandomTrip };
