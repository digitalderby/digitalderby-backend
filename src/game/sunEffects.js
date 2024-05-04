"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunny = void 0;
var Sunny = /** @class */ (function () {
    function Sunny() {
        this.name = 'Sunny';
    }
    Sunny.prototype.effect = function (race) {
        race.staminaDrainFactor = 1.2;
    };
    return Sunny;
}());
exports.Sunny = Sunny;
