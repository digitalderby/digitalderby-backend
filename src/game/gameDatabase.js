"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_js_1 = require("../random/random.js");
var horse_js_1 = require("./horse/horse.js");
var race_js_1 = require("./race.js");
var HORSE_POPULATION = 1000;
var HORSES_PER_RACE = 4;
var GameDatabase = /** @class */ (function () {
    function GameDatabase() {
        this.horses = [];
    }
    /** Populate the database with a population of horses */
    GameDatabase.prototype.populate = function () {
        try {
            this.horses = Array.from({ length: HORSE_POPULATION }, function (_v, i) { return horse_js_1.Horse.random(i); });
        }
        catch (error) {
            console.error("Error populating horses:", error);
        }
    };
    /** Create a new race by taking a random sample of horses from the population */
    GameDatabase.prototype.createRace = function () {
        var _this = this;
        console.log('creating race');
        var indices = (0, random_js_1.randomIndicesNoReplacement)(HORSE_POPULATION, HORSES_PER_RACE);
        if (indices === null) {
            throw new Error("Failed to generate random indices for race.");
        }
        console.log('created race');
        return new race_js_1.Race(indices.map(function (i) { return _this.horses[i]; }));
    };
    return GameDatabase;
}());
var database = new GameDatabase();
database.populate();
exports.default = database;
