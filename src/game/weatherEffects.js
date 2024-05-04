"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollForWeatherEffect = void 0;
var random_js_1 = require("../random/random.js");
var rainEffects_js_1 = require("./rainEffects.js");
var sunEffects_js_1 = require("./sunEffects.js");
var weights = [
    { value: null, weight: 90 },
    { value: new rainEffects_js_1.Rain(), weight: 5 },
    { value: new sunEffects_js_1.Sunny(), weight: 5 },
];
function rollForWeatherEffect() {
    return (0, random_js_1.weightedRandom)(weights);
}
exports.rollForWeatherEffect = rollForWeatherEffect;
