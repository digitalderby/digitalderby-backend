"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalHorse = exports.STAMINA_BOUNDS = exports.ACCELERATION_BOUNDS = exports.SPEED_BOUNDS = void 0;
exports.SPEED_BOUNDS = [50, 100];
exports.ACCELERATION_BOUNDS = [1, 5];
exports.STAMINA_BOUNDS = [500, 600];
function interpolate(specStatValue, bounds) {
    var normalized = (specStatValue - 3) / 17;
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]));
}
var InternalHorse = /** @class */ (function () {
    function InternalHorse(horseSpec) {
        this.spec = horseSpec;
        this.topSpeed = interpolate(horseSpec.stats.topSpeed, exports.SPEED_BOUNDS);
        this.acceleration = interpolate(horseSpec.stats.acceleration, exports.ACCELERATION_BOUNDS);
        this.stamina = interpolate(horseSpec.stats.stamina, exports.STAMINA_BOUNDS);
    }
    return InternalHorse;
}());
exports.InternalHorse = InternalHorse;
