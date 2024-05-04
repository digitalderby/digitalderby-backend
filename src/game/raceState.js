"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorseState = exports.RaceState = void 0;
var globalsettings_js_1 = require("../config/globalsettings.js");
var horse_js_1 = require("./horse/horse.js");
var dt = globalsettings_js_1.SERVER_TICK_RATE_MS / 1000;
var lowPlacementFactors = [1, 0.75, 0.5, 0.25];
var highPlacementFactors = [0.25, 0.5, 0.75, 1];
function lowSpeedProb(factor) {
    var staminaFactor = factor.staminaPercent < 0.2
        ? 0.5 + ((0.2 - factor.staminaPercent) / 0.2) * 0.5
        : 0;
    var placementFactor = lowPlacementFactors[factor.placement];
    var timeFactor = globalsettings_js_1.SERVER_TICK_RATE_MS / (1000 * 4);
    return staminaFactor * placementFactor * timeFactor;
}
function highSpeedProb(factor) {
    var staminaFactor = factor.staminaPercent > 0.5
        ? 0.5 + ((factor.staminaPercent - 0.5) / 0.5) * 0.5
        : 0.25;
    var placementFactor = highPlacementFactors[factor.placement];
    var timeFactor = globalsettings_js_1.SERVER_TICK_RATE_MS / (1000 * 4);
    return staminaFactor * placementFactor * timeFactor;
}
function rollForModeBuff(factor) {
    var lowProb = lowSpeedProb(factor);
    var highProb = highSpeedProb(factor);
    if (Math.random() < lowProb) {
        return {
            mode: 'low',
            duration: horse_js_1.MODE_DURATION,
        };
    }
    else if (Math.random() < highProb) {
        return {
            mode: 'high',
            duration: horse_js_1.MODE_DURATION * (0.5 + Math.random() * 1.5),
        };
    }
    return null;
}
var RaceState = /** @class */ (function () {
    function RaceState(race) {
        this.horseStates = [];
        this.rankings = [];
        this.time = 0;
        this.length = globalsettings_js_1.RACE_LENGTH;
        if (race) {
            this.horseStates = race.horses.map(function (h) { return new HorseState(h); });
            this.rankings = Array.from({ length: this.horseStates.length }, function (_, i) { return i; });
        }
    }
    RaceState.prototype.nextState = function (race) {
        var _this = this;
        var next = new RaceState();
        var queuedStatusEffects = [];
        next.time = this.time + globalsettings_js_1.SERVER_TICK_RATE_MS;
        // Perform movement/stamina updates for the horse state.
        next.horseStates = this.horseStates.map(function (hs, horseIdx) {
            if (hs.finishTime !== null) {
                return hs;
            }
            var nextHs = new HorseState(hs.horse);
            var staminaPercent = hs.currentStamina / hs.horse.stamina;
            var currentPlacement = _this.placement(horseIdx);
            var positionPercent = hs.position / globalsettings_js_1.RACE_LENGTH;
            // Tick down status effects.
            for (var _i = 0, _a = hs.statusEffects; _i < _a.length; _i++) {
                var status_1 = _a[_i];
                if (status_1.duration >= 0) {
                    nextHs.statusEffects.push({
                        name: status_1.name,
                        duration: status_1.duration - globalsettings_js_1.SERVER_TICK_RATE_MS,
                    });
                }
            }
            var trip = hs.hasStatus('trip');
            // Calculate modifiers based on current stats.
            var targetSpeed = hs.speedMode === 'high'
                ? hs.horse.highSpeed
                : hs.speedMode === 'mid'
                    ? hs.horse.midSpeed
                    : hs.horse.lowSpeed;
            // If the horse tripped, set target speed to 0.
            if (trip) {
                targetSpeed = 0;
            }
            // Move position by currentSpeed
            nextHs.position = hs.position + hs.currentSpeed * dt;
            // If the horse reaches the end, set their finish time
            if (nextHs.position >= globalsettings_js_1.RACE_LENGTH) {
                nextHs.position = globalsettings_js_1.RACE_LENGTH;
                nextHs.finishTime = next.time;
            }
            // Decelerate if we are faster than the target speed
            if (nextHs.currentSpeed > targetSpeed) {
                nextHs.currentSpeed = Math.max(hs.currentSpeed - horse_js_1.DECELERATION * dt, targetSpeed);
            }
            // Accelerate if we are behind the target speed
            var accelMultiplier = hs.speedMode === 'high' ? 2 : 1;
            nextHs.currentSpeed = Math.min(hs.currentSpeed + accelMultiplier * hs.horse.acceleration * dt, targetSpeed);
            // If speed is below the stamina threshold, replenish stamina,
            // otherwise drain it.
            // If going slow, you will always recover 12.5% stamina per second.
            // If going fast, stamina consumption increases.
            var staminaChange = horse_js_1.STAMINA_THRESHOLD - hs.currentSpeed;
            if (hs.speedMode === 'low') {
                staminaChange = Math.max(staminaChange, hs.horse.stamina / 8);
            }
            else if (hs.speedMode === 'high') {
                staminaChange += 200;
            }
            staminaChange *= dt;
            if (staminaChange < 0) {
                staminaChange *= race.staminaDrainFactor;
            }
            nextHs.currentStamina = Math.min(hs.horse.stamina, Math.max(0, hs.currentStamina + staminaChange));
            // If the horse is currently deciding to go at 'low' or 'high'
            // speed for a time, decrease the buff duration
            if (hs.modeBuff !== null && hs.modeBuff.duration > 0) {
                nextHs.modeBuff = {
                    mode: hs.modeBuff.mode,
                    duration: hs.modeBuff.duration - globalsettings_js_1.SERVER_TICK_RATE_MS,
                };
                // If out of stamina, enter 'low' mode
            }
            else if (nextHs.currentStamina <= 0) {
                nextHs.modeBuff = {
                    mode: 'low',
                    duration: horse_js_1.MODE_DURATION,
                };
            }
            else {
                var factor = {
                    staminaPercent: staminaPercent,
                    placement: currentPlacement,
                    positionPercent: positionPercent,
                };
                nextHs.modeBuff = rollForModeBuff(factor);
            }
            // If there is no active buff, horse is moving at 'mid' speed-
            // otherwise, at the speed defined by the mode buff
            nextHs.speedMode =
                nextHs.modeBuff === null ? 'mid' : nextHs.modeBuff.mode;
            // If the horse hasn't tripped, every tick add a mild probability
            // the horse trips.
            var tripFactor = (hs.currentSpeed - horse_js_1.TRIP_LOW_SPEED) / (horse_js_1.TRIP_HIGH_SPEED - horse_js_1.TRIP_LOW_SPEED);
            if (!trip && Math.random() < tripFactor * race.tripProbability) {
                queuedStatusEffects.push({
                    horseIdx: horseIdx,
                    status: {
                        name: 'trip',
                        duration: horse_js_1.TRIP_DURATION_MS,
                    },
                });
            }
            return nextHs;
        });
        // Apply all queued status effects to the horses
        for (var _i = 0, queuedStatusEffects_1 = queuedStatusEffects; _i < queuedStatusEffects_1.length; _i++) {
            var _a = queuedStatusEffects_1[_i], horseIdx = _a.horseIdx, status_2 = _a.status;
            next.horseStates[horseIdx].statusEffects.push(status_2);
        }
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
    RaceState.prototype.placement = function (horseIdx) {
        return this.rankings.findIndex(function (idx) { return horseIdx === idx; });
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
        this.currentStamina = 0;
        this.finishTime = null;
        this.speedMode = 'mid';
        this.modeBuff = null;
        this.statusEffects = [];
        this.horse = horse;
        this.currentStamina = horse.stamina;
    }
    HorseState.prototype.hasStatus = function (status) {
        return this.statusEffects.find(function (se) { return se.name === status; }) !== undefined;
    };
    return HorseState;
}());
exports.HorseState = HorseState;
