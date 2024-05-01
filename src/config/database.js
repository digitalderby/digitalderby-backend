"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config.js");
var mongoose_1 = require("mongoose");
var db = mongoose_1.default.connection;
var opts = {};
if (process.env.DATABASE_URI === undefined) {
    throw new Error('Database not defined in the .env file- cannot run.');
}
console.log('Connecting to MongoDB instance...');
mongoose_1.default.connect(process.env.DATABASE_URI);
db.on('connected', function () {
    console.log("Successfully connected to MongoDB ".concat(db.name, " at ").concat(db.host, ":").concat(db.port, "."));
});
exports.default = db;
