"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRace = exports.generateLocalHorsesFromSpecs = exports.loadHorsesFromDatabase = exports.localHorses = exports.HORSES_PER_RACE = exports.HORSE_POPULATION = void 0;
var Horse_js_1 = require("../../models/Horse.js");
var random_js_1 = require("../../random/random.js");
var race_js_1 = require("../race.js");
var horse_js_1 = require("./horse.js");
exports.HORSE_POPULATION = 100;
exports.HORSES_PER_RACE = 4;
/** Collection of horses in memory for the game server to access and manipulate */
exports.localHorses = [];
function loadHorsesFromDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var horseSpecs, horses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Loading horses from database...');
                    return [4 /*yield*/, Horse_js_1.Horse.find()];
                case 1:
                    horseSpecs = _a.sent();
                    if (!(horseSpecs.length !== exports.HORSE_POPULATION)) return [3 /*break*/, 4];
                    console.log('Not enough horses in database; regenerating them.');
                    // Delete all horses already in the database first
                    return [4 /*yield*/, Horse_js_1.Horse.deleteMany({})];
                case 2:
                    // Delete all horses already in the database first
                    _a.sent();
                    horses = (0, Horse_js_1.generateNewHorses)()
                        .map(function (h) { return new Horse_js_1.Horse(h); });
                    generateLocalHorsesFromSpecs(horses);
                    return [4 /*yield*/, Promise.all(horses.map(function (hm) { return hm.save(); }))];
                case 3:
                    _a.sent();
                    console.log('Loading successful');
                    return [2 /*return*/];
                case 4:
                    exports.localHorses = horseSpecs.map(function (hs) { return new horse_js_1.InternalHorse(hs); });
                    console.log('Loading successful');
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadHorsesFromDatabase = loadHorsesFromDatabase;
/**
 * Populates the local horse collection with horses from the given array of
 * horse specs.
 *
 * @param {IHorse[]} horseSpecs - Array of horse specs from the database
 */
function generateLocalHorsesFromSpecs(horseSpecs) {
    console.log('Recreating local horse collection');
    exports.localHorses = horseSpecs.map(function (hs) { return new horse_js_1.InternalHorse(hs); });
    console.log('Finished recreating local horse collection');
}
exports.generateLocalHorsesFromSpecs = generateLocalHorsesFromSpecs;
function createRace() {
    console.log('creating race');
    var indices = (0, random_js_1.randomIndicesNoReplacement)(exports.HORSE_POPULATION, exports.HORSES_PER_RACE);
    if (indices === null) {
        return null;
    }
    var race = new race_js_1.Race(indices.map(function (i) { return exports.localHorses[i]; }));
    console.log('created race');
    return race;
}
exports.createRace = createRace;
await loadHorsesFromDatabase();
