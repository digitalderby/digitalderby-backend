"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var horses_js_1 = require("../controllers/horses.js");
var router = express_1.Router();
router.get('/', horses_js_1.getAllHorses);
router.get('/:id', horses_js_1.getHorseById);
router.get('/:id/lastGames', horses_js_1.getHorsesLastGames);
exports.default = router;
