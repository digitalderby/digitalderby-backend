"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horse = exports.STAMINA_BOUNDS = exports.ACCELERATION_BOUNDS = exports.SPEED_BOUNDS = void 0;
var random_js_1 = require("../../random/random.js");
exports.SPEED_BOUNDS = [50, 100];
exports.ACCELERATION_BOUNDS = [1, 5];
exports.STAMINA_BOUNDS = [500, 600];
var Horse = /** @class */ (function () {
    function Horse(_a) {
        var _b = _a.id, id = _b === void 0 ? 0 : _b, _c = _a.topSpeed, topSpeed = _c === void 0 ? 5 : _c, _d = _a.stamina, stamina = _d === void 0 ? 5 : _d, _e = _a.acceleration, acceleration = _e === void 0 ? 5 : _e;
        this.id = id;
        this.topSpeed = topSpeed;
        this.stamina = stamina;
        this.acceleration = acceleration;
    }
    Horse.random = function (id) {
        return new Horse({
            id: id,
            topSpeed: (0, random_js_1.randFromBounds)(exports.SPEED_BOUNDS),
            acceleration: (0, random_js_1.randFromBounds)(exports.ACCELERATION_BOUNDS),
            stamina: (0, random_js_1.randFromBounds)(exports.STAMINA_BOUNDS),
        });
    };
    return Horse;
}());
exports.Horse = Horse;
