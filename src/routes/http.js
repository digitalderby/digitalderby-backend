"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authentication_js_1 = require("../auth/authentication.js");
var http_js_1 = require("../controllers/http.js");
var router = express_1.Router();
router.get('/currentGame', http_js_1.getCurrentGame);
router.get('/wallet', authentication_js_1.loggedInAsUser, http_js_1.getWallet);
router.get('/currentGame/bet', authentication_js_1.loggedInAsUser, http_js_1.getBetOnCurrentGame);
router.put('/currentGame/bet', authentication_js_1.loggedInAsUser, http_js_1.setBetOnCurrentGame);
router.delete('/currentGame/bet', authentication_js_1.loggedInAsUser, http_js_1.clearBetOnCurrentGame);
exports.default = router;
