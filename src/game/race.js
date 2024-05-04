"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Race = void 0;
var globalsettings_js_1 = require("../config/globalsettings.js");
var horse_js_1 = require("./horse/horse.js");
var weatherEffects_js_1 = require("./weatherEffects.js");
var Race = /** @class */ (function () {
    function Race(horses) {
        this.tripProbability = horse_js_1.TRIP_PROBABILITY;
        this.staminaDrainFactor = 1;
        this.weatherConditions = null;
        this.horses = horses;
        this.length = globalsettings_js_1.RACE_LENGTH;
        this.weatherConditions = (0, weatherEffects_js_1.rollForWeatherEffect)();
    }
    return Race;
}());
exports.Race = Race;
