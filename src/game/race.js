"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Race = void 0;
var globalsettings_js_1 = require("../config/globalsettings.js");
var Race = /** @class */ (function () {
    function Race(horses) {
        this.horses = horses;
        this.length = globalsettings_js_1.RACE_LENGTH;
    }
    return Race;
}());
exports.Race = Race;
