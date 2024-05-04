"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalHorse = exports.TRIP_DURATION_MS = exports.TRIP_PROBABILITY = exports.TRIP_HIGH_SPEED = exports.TRIP_LOW_SPEED = exports.MODE_DURATION = exports.DECELERATION = exports.STAMINA_THRESHOLD = exports.STAMINA_BOUNDS = exports.ACCELERATION_BOUNDS = exports.HIGH_SPEED_BOUNDS = exports.MID_SPEED_BOUNDS = exports.LOW_SPEED_BOUNDS = void 0;
var globalsettings_js_1 = require("../../config/globalsettings.js");
exports.LOW_SPEED_BOUNDS = [400, 450];
exports.MID_SPEED_BOUNDS = [600, 650];
exports.HIGH_SPEED_BOUNDS = [800, 900];
exports.ACCELERATION_BOUNDS = [400, 440];
exports.STAMINA_BOUNDS = [180, 220];
exports.STAMINA_THRESHOLD = 500;
exports.DECELERATION = 12;
exports.MODE_DURATION = 4000;
exports.TRIP_LOW_SPEED = 500;
exports.TRIP_HIGH_SPEED = 1200;
exports.TRIP_PROBABILITY = globalsettings_js_1.SERVER_TICK_RATE_MS / (1000 * 10);
exports.TRIP_DURATION_MS = 1000;
function interpolate(specStatValue, bounds) {
    var normalized = (specStatValue - 3) / 17;
    return bounds[0] + Math.floor(normalized * (bounds[1] - bounds[0]));
}
var InternalHorse = /** @class */ (function () {
    function InternalHorse(horseSpec) {
        this.spec = horseSpec;
        this.highSpeed = interpolate(horseSpec.stats.topSpeed, exports.HIGH_SPEED_BOUNDS);
        this.midSpeed = interpolate(horseSpec.stats.topSpeed, exports.MID_SPEED_BOUNDS);
        this.lowSpeed = interpolate(horseSpec.stats.topSpeed, exports.LOW_SPEED_BOUNDS);
        this.acceleration = interpolate(horseSpec.stats.acceleration, exports.ACCELERATION_BOUNDS);
        this.stamina = interpolate(horseSpec.stats.stamina, exports.STAMINA_BOUNDS);
    }
    return InternalHorse;
}());
exports.InternalHorse = InternalHorse;
