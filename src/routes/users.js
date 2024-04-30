"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_js_1 = require("../controllers/users.js");
var router = express_1.Router();
router.get('/', users_js_1.getAllUsers);
router.get('/:uname', users_js_1.getUserById);
exports.default = router;
