"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rain = void 0;
var horse_js_1 = require("./horse/horse.js");
var Rain = /** @class */ (function () {
    function Rain() {
        this.name = 'Rain';
    }
    Rain.prototype.effect = function (race) {
        race.tripProbability = horse_js_1.TRIP_PROBABILITY * 3;
    };
    return Rain;
}());
exports.Rain = Rain;
