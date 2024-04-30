"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorseState = exports.RaceState = void 0;
var race_js_1 = require("./race.js");
var gameServer_js_1 = require("./gameServer.js");
var RaceState = /** @class */ (function () {
    function RaceState(race) {
        this.horseStates = [];
        this.rankings = [];
        this.time = 0;
        if (race) {
            this.horseStates = race.horses.map(function (h) { return new HorseState(h); });
            this.rankings = Array.from({ length: this.horseStates.length }, function (_, i) { return i; });
        }
    }
    RaceState.prototype.nextState = function () {
        var next = new RaceState();
        next.time = this.time + gameServer_js_1.SERVER_TICK_RATE_MS;
        next.horseStates = this.horseStates.map(function (hs) {
            if (hs.finishTime !== null) {
                return hs;
            }
            var nextHs = new HorseState(hs.horse);
            nextHs.currentSpeed =
                Math.min(hs.currentSpeed + hs.horse.acceleration, hs.horse.topSpeed);
            nextHs.position = hs.position + hs.currentSpeed;
            if (nextHs.position > race_js_1.RACE_DURATION) {
                nextHs.position = race_js_1.RACE_DURATION;
                nextHs.finishTime = next.time;
            }
            return nextHs;
        });
        next.rankings = Array.from({ length: this.horseStates.length }, function (_, i) { return i; });
        next.recomputeRankings();
        return next;
    };
    RaceState.prototype.recomputeRankings = function () {
        var _this = this;
        this.rankings.sort(function (idxI, idxJ) {
            var horseI = _this.horseStates[idxI];
            var horseJ = _this.horseStates[idxJ];
            if (horseI.finishTime !== null && horseJ.finishTime !== null) {
                if (Math.abs(horseI.finishTime - horseJ.finishTime) > 0) {
                    return horseI.finishTime - horseJ.finishTime;
                }
                else {
                    return idxI - idxJ;
                }
            }
            else if (horseI.finishTime !== null) {
                return -1;
            }
            else if (horseJ.finishTime !== null) {
                return 1;
            }
            else {
                if (Math.abs(horseI.position - horseJ.position) > 0) {
                    return horseJ.position - horseI.position;
                }
                else {
                    return idxI - idxJ;
                }
            }
        });
    };
    RaceState.prototype.raceOver = function () {
        return this.horseStates.every(function (hs) { return hs.finishTime !== null; });
    };
    return RaceState;
}());
exports.RaceState = RaceState;
var HorseState = /** @class */ (function () {
    function HorseState(horse) {
        this.position = 0;
        this.currentSpeed = 0;
        this.finishTime = null;
        this.horse = horse;
    }
    return HorseState;
}());
exports.HorseState = HorseState;
