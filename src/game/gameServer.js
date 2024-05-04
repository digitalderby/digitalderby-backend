"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
var cors_js_1 = require("./../cors.js");
var socket_io_1 = require("socket.io");
var clientInfo_js_1 = require("../clientInfo.js");
var time_js_1 = require("../time/time.js");
var raceState_js_1 = require("./raceState.js");
var localHorses_js_1 = require("./horse/localHorses.js");
var betInfo_js_1 = require("./betInfo.js");
var jsonwebtoken_1 = require("jsonwebtoken");
var secrets_js_1 = require("../auth/secrets.js");
var GameLog_js_1 = require("../models/GameLog.js");
var User_js_1 = require("../models/User.js");
var globalsettings_js_1 = require("../config/globalsettings.js");
console.log("Betting delay: ".concat(globalsettings_js_1.BETTING_DELAY));
console.log("Pre-race delay: ".concat(globalsettings_js_1.PRERACE_DELAY));
console.log("Results delay: ".concat(globalsettings_js_1.RESULTS_DELAY));
var ServerInactiveError = {
    message: 'Server is inactive',
};
/** The base server for the game. */
var GameServer = /** @class */ (function () {
    function GameServer() {
        this.serverStatus = 'closed';
        /** Internal Socket.IO server. */
        this.io = null;
        /** Map between the Socket.IO ids of each client and a container
         *   for their client info */
        this.clients = new Map();
        this.bets = new Map();
        this.pool = [];
        this.totalPool = 0;
        this.messages = [];
        this.lag = 0n;
        this.prevTime = (0, time_js_1.hrTimeMs)();
        /** The current race, if it exists. */
        this.race = null;
        /** Current server status.
         * Betting - Race is visible to all players. Players may send 'bet' actions
         * to indicate that they will bet a certain amount on a horse to win.
         * Race - Race is being simulated.
         * Results - Race has finished, and the game server will simply display
         * the finished status. */
        this.raceStatus = 'betting';
        /** Timer that ticks down to zero in betting mode before a race begins. */
        this.bettingTimer = 0;
        this.bettingEndTimestamp = new Date();
        /** Timer that ticks down to zero in race mode before a race begins. */
        this.preRaceTimer = 0;
        this.preraceEndTimestamp = new Date();
        /** Timer that ticks down to zero in results mode before a new round begins. */
        this.resultsTimer = 0;
        this.resultsEndTimestamp = new Date();
        this._loopCancelFunction = null;
        /** Array of all race states */
        this.raceStates = null;
    }
    // TODO: add jsdocs
    GameServer.prototype.createServer = function (server) {
        var _this = this;
        if (this.serverStatus !== 'closed') {
            throw { message: 'Server already created' };
        }
        console.log('Creating server...');
        // Create a new Socket.IO server using the given HTTP connection.
        this.io = new socket_io_1.Server(server, {
            cors: cors_js_1.default,
        });
        this.clients = new Map();
        this.messages = [];
        // For each client that connects to the server, set up the corresponding
        // event listeners.
        this.io
            .of('/user')
            .use(function (socket, next) { return _this.closedMiddleware(socket, next); });
        this.io
            .of('/user')
            .use(function (socket, next) { return _this.authMiddleware(socket, next); });
        this.io.of('/user').on('connection', function (sk) { return _this.userHandler(sk); });
        console.log('Server successfully created');
        this.openServer();
    };
    GameServer.prototype.openServer = function () {
        this.serverStatus = 'inactive';
        this.startBettingMode();
        this.clients = new Map();
        console.log('Server is now open');
    };
    GameServer.prototype.closeServer = function () {
        if (this.io === null) {
            throw { message: 'Server already closed' };
        }
        this.stopMainLoop();
        console.log('Disconnecting all clients...');
        this.io.of('/user').disconnectSockets();
        this.clients = new Map();
        this.serverStatus = 'closed';
        console.log('Server is now closed');
    };
    GameServer.prototype.closedMiddleware = function (_socket, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Handling inbound socket.');
                if (this.serverStatus === 'closed') {
                    console.log('Rejected: server is closed');
                    next(new Error('Server is closed, cannot connect'));
                }
                next();
                return [2 /*return*/];
            });
        });
    };
    GameServer.prototype.authMiddleware = function (socket, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, payload, _i, _a, clientName, user, error_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("Extracting socket's JWT.");
                        token = ((_b = socket.handshake.auth) === null || _b === void 0 ? void 0 : _b.token) || ((_c = socket.handshake.headers) === null || _c === void 0 ? void 0 : _c.token);
                        if (token === undefined) {
                            console.log('Rejected: JWT was not provided');
                            next(new Error('Must provide token in either auth or headers'));
                            return [2 /*return*/];
                        }
                        try {
                            payload = jsonwebtoken_1.default.verify(token, secrets_js_1.jwtSecret);
                        }
                        catch (error) {
                            next(new Error('Could not verify JWT.'));
                            return [2 /*return*/];
                        }
                        if (typeof payload === 'string') {
                            console.log('Rejected: JWT was not parsed correctly');
                            next(new Error("Could not parse JWT: ".concat(payload)));
                            return [2 /*return*/];
                        }
                        if (payload.username === 'undefined') {
                            console.log('Rejected: JWT is not in the correct format');
                            next(new Error("JWT has a bad payload"));
                            return [2 /*return*/];
                        }
                        for (_i = 0, _a = this.clients.keys(); _i < _a.length; _i++) {
                            clientName = _a[_i];
                            if (clientName === payload.username) {
                                next(new Error("User already logged in"));
                                return [2 /*return*/];
                            }
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, User_js_1.User.findOne({ username: payload.username })];
                    case 2:
                        user = _d.sent();
                        if (!user) {
                            console.log('Rejected: Could not find user in the database');
                            next(new Error("Could not find user ".concat(payload.username)));
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _d.sent();
                        console.log('Rejected: Could not find user due to database error');
                        next(new Error("Could not retrieve user from database"));
                        return [2 /*return*/];
                    case 4:
                        socket.data = {
                            username: payload.username,
                            id: user._id,
                            wallet: user.profile.wallet,
                            bankruptcies: user.profile.bankruptcies,
                        };
                        console.log('Successfully authenticated the socket');
                        console.log(socket.data);
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameServer.prototype.userHandler = function (socket) {
        var _this = this;
        var clientInfo = new clientInfo_js_1.ClientInfo(socket);
        // Initially clients are unauthenticated. Clients may authenticate
        // themselves by sending a 'login' message to the server.
        this.clients.set(socket.data.username, clientInfo);
        // Set up socket middleware to log all inbound socket requests.
        socket.use(function (_a, next) {
            var event = _a[0], args = _a.slice(1);
            console.log("".concat(socket.data.username, ": (").concat(event, ") (").concat(args, ")"));
            next();
        });
        // Client closed the connection.
        socket.on('disconnect', function () {
            _this.clients.delete(socket.data.username);
        });
        // Client places a bet on a given horse
        socket.on('bet', function (_a, res) {
            var betValue = _a.betValue, horseIdx = _a.horseIdx;
            var callback = res;
            if (callback === undefined) {
                callback = function (payload) {
                    socket.emit('debuglog', payload);
                };
            }
            if (_this.raceStatus !== 'betting') {
                callback({
                    message: 'Not in betting mode',
                });
                return;
            }
            if (_this.race === null) {
                callback({
                    message: 'No race has started',
                });
                return;
            }
            var currentBet = _this.bets.get(clientInfo.username);
            if (currentBet !== undefined) {
                _this.bets.delete(clientInfo.username);
            }
            if (betValue > clientInfo.wallet) {
                callback({
                    message: 'Not enough balance to make bet',
                });
                return;
            }
            if (!isFinite(betValue)) {
                callback({
                    message: 'Bet is an invalid numeric quantity',
                });
                return;
            }
            if (betValue < globalsettings_js_1.MINIMUM_BET) {
                callback({
                    message: "Bet must be at least ".concat(globalsettings_js_1.MINIMUM_BET),
                });
                return;
            }
            _this.bets.set(clientInfo.username, new betInfo_js_1.BetInfo({
                username: clientInfo.username,
                id: clientInfo.id,
                betValue: Math.floor(betValue),
                horseIdx: horseIdx,
                horseId: _this.race.horses[horseIdx].spec._id,
            }));
            _this.recomputePool();
            _this.emitClientStatus(clientInfo);
            _this.broadcastStateV2();
            callback({
                message: 'ok',
                betValue: betValue,
                horseIdx: horseIdx,
            });
        });
        // Player clears their bet
        socket.on('clearBet', function (res) {
            var callback = res;
            if (callback === undefined) {
                callback = function (payload) {
                    socket.emit('debuglog', payload);
                };
            }
            if (_this.raceStatus !== 'betting') {
                res({
                    message: 'Not in betting mode',
                });
            }
            var currentBet = _this.bets.get(clientInfo.username);
            if (currentBet !== undefined) {
                _this.bets.delete(clientInfo.username);
            }
            _this.recomputePool();
            _this.emitClientStatus(clientInfo);
            _this.broadcastStateV2();
            res({
                message: 'ok',
            });
        });
        console.log('Successfully set up event listeners');
        socket.emit('username', socket.data.username);
        this.emitClientStatus(clientInfo);
        this.broadcastStateV2();
    };
    GameServer.prototype.emitClientStatus = function (client) {
        var payload = {
            username: client.username,
            id: client.id,
            wallet: client.wallet,
            bankruptcies: client.bankruptcies,
            bet: null,
        };
        var bet = this.bets.get(client.username);
        if (bet !== undefined) {
            payload.bet = {
                betValue: bet.betValue,
                horseIdx: bet.horseIdx,
            };
        }
        client.socket.emit('clientStatus', payload);
    };
    GameServer.prototype.startBettingMode = function () {
        var _a;
        console.log('Entering betting mode');
        this.raceStatus = 'betting';
        this.race = (0, localHorses_js_1.createRace)();
        console.log((_a = this.race) === null || _a === void 0 ? void 0 : _a.weatherConditions);
        this.bettingTimer = globalsettings_js_1.BETTING_DELAY * 1000;
        this.bettingEndTimestamp = new Date(Date.now() + globalsettings_js_1.BETTING_DELAY * 1000);
        this.raceStates = null;
        this.bets = new Map();
        this.pool = Array(globalsettings_js_1.HORSES_PER_RACE).fill(0);
        this.totalPool = 0;
        for (var _i = 0, _b = this.clients.values(); _i < _b.length; _i++) {
            var client = _b[_i];
            this.emitClientStatus(client);
        }
        this.broadcastStateV2();
    };
    GameServer.prototype.startRaceMode = function () {
        console.log('Entering race mode');
        this.raceStatus = 'race';
        this.preRaceTimer = globalsettings_js_1.PRERACE_DELAY * 1000;
        this.preraceEndTimestamp = new Date(Date.now() + globalsettings_js_1.PRERACE_DELAY * 1000);
        if (this.race === null) {
            throw new Error('no race');
        }
        this.recomputePool();
        console.log("Current pool: ".concat(this.pool));
        console.log("Total: ".concat(this.totalPool));
        this.raceStates = [new raceState_js_1.RaceState(this.race)];
        // If cheat mode is enabled, always put horses at the end
        if (globalsettings_js_1.CHEAT_MODE) {
            this.raceStates[0].horseStates[0].position = globalsettings_js_1.RACE_LENGTH - 1;
        }
        this.broadcastStateV2();
    };
    GameServer.prototype.startResultsMode = function () {
        console.log('Entering results mode');
        this.raceStatus = 'results';
        this.resultsTimer = globalsettings_js_1.RESULTS_DELAY * 1000;
        this.resultsEndTimestamp = new Date(Date.now() + globalsettings_js_1.RESULTS_DELAY * 1000);
        if (this.raceStates === null) {
            throw new Error('Could not enter results mode');
        }
        // Get the end state of the race
        var lastState = this.raceStates[this.raceStates.length - 1];
        for (var _i = 0, _a = this.bets.values(); _i < _a.length; _i++) {
            var bet = _a[_i];
            var client = this.clients.get(bet.username);
            if (client === undefined) {
                continue;
            }
            // For each player who bet on the winning horse, pay them the total pool times the fraction they put on a given horse
            if (bet.horseIdx === lastState.rankings[0]) {
                bet.returns =
                    this.totalPool * Math.floor(bet.betValue / this.pool[bet.horseIdx]);
            }
            var newBalance = client.wallet + bet.returns - bet.betValue;
            if (newBalance < globalsettings_js_1.MINIMUM_BET) {
                bet.wentBankrupt = true;
            }
            if (bet.wentBankrupt) {
                console.log("Player ".concat(bet.username, " went bankrupt- reset balance to ").concat(globalsettings_js_1.DEFAULT_WALLET));
            }
            else {
                console.log("Player ".concat(bet.username, " ").concat(bet.returns > 0 ? 'receives' : 'loses', " ").concat(Math.abs(bet.returns - bet.betValue), " from their bet on horse ").concat(bet.horseIdx + 1));
            }
        }
        // do persistence stuff
        this.commitGame();
        this.broadcastStateV2();
    };
    GameServer.prototype.handleTick = function () {
        switch (this.raceStatus) {
            case 'betting': {
                if (this.bettingTimer > 0) {
                    this.bettingTimer -= globalsettings_js_1.SERVER_TICK_RATE_MS;
                    return;
                }
                this.startRaceMode();
                return;
            }
            case 'race': {
                if (this.preRaceTimer > 0) {
                    this.preRaceTimer -= globalsettings_js_1.SERVER_TICK_RATE_MS;
                    return;
                }
                // Otherwise, compute the next state and add it to the
                // list of race states in memory
                if (this.raceStates === null) {
                    throw new Error('no race states');
                }
                var currentState = this.raceStates[this.raceStates.length - 1];
                if (currentState.raceOver()) {
                    this.startResultsMode();
                    return;
                }
                if (this.race === null) {
                    throw new Error('no race');
                }
                var nextState = currentState.nextState(this.race);
                this.raceStates.push(nextState);
                break;
            }
            case 'results': {
                if (this.resultsTimer > 0) {
                    this.resultsTimer -= globalsettings_js_1.SERVER_TICK_RATE_MS;
                    return;
                }
                // start a new race if we're autorestarting
                this.startBettingMode();
                break;
            }
        }
    };
    GameServer.prototype.broadcastStateV2 = function (lag) {
        var _a;
        if (this.io === null) {
            return;
        }
        if (this.race === null) {
            return;
        }
        var currLag = lag;
        if (currLag === undefined) {
            var now = (0, time_js_1.hrTimeMs)();
            currLag = this.lag + (now - this.prevTime);
        }
        var payload;
        var general = {
            numClients: this.clients.size,
            lag: Number(currLag),
            race: {
                horses: this.race.horses.map(function (h) { return ({
                    horseName: h.spec.name,
                    horseId: h.spec._id.toString(),
                    horseColor: h.spec.color,
                    horseIcons: h.spec.icons,
                }); }),
                raceLength: this.race.length,
                weatherConditions: ((_a = this.race.weatherConditions) === null || _a === void 0 ? void 0 : _a.name) || 'Clear',
            },
            currentPoolValue: this.totalPool,
            minimumBet: globalsettings_js_1.MINIMUM_BET,
        };
        switch (this.raceStatus) {
            case 'betting': {
                payload = __assign(__assign({}, general), { status: 'betting', raceStartTime: this.bettingEndTimestamp });
                break;
            }
            case 'race': {
                if (this.raceStates === null) {
                    return;
                }
                var lastState = this.raceStates[this.raceStates.length - 1];
                payload = __assign(__assign({}, general), { status: 'race', preraceStartTime: this.preRaceTimer > 0 ? undefined : this.preraceEndTimestamp, eventMessages: this.messages, raceState: {
                        horseStates: lastState.horseStates.map(function (hs) { return ({
                            position: hs.position,
                            speed: hs.currentSpeed,
                            isFinished: hs.finishTime !== null,
                            finishTime: hs.finishTime !== null ? hs.finishTime : undefined,
                        }); }),
                        rankings: lastState.rankings,
                    } });
                break;
            }
            case 'results': {
                if (this.raceStates === null) {
                    return;
                }
                var lastState = this.raceStates[this.raceStates.length - 1];
                payload = __assign(__assign({}, general), { status: 'results', nextRaceStartTime: this.resultsEndTimestamp, rankings: lastState.rankings, finishTimes: lastState.horseStates.map(function (hs) { return hs.finishTime; }) });
                break;
            }
        }
        this.io.of('/user').emit('gamestatev2', payload);
    };
    GameServer.prototype.emitStateV1 = function (lag) {
        if (this.io === null) {
            throw ServerInactiveError;
        }
        switch (this.raceStatus) {
            case 'betting':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag),
                    race: this.race,
                    bettingTimer: this.bettingTimer,
                });
                break;
            case 'race':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag),
                    preRaceTimer: this.preRaceTimer,
                    raceStates: this.raceStates === null
                        ? null
                        : this.raceStates[this.raceStates.length - 1],
                });
                break;
            case 'results':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag),
                    resultsTimer: this.resultsTimer,
                    raceStates: this.raceStates === null
                        ? null
                        : this.raceStates[this.raceStates.length - 1],
                });
                break;
        }
    };
    GameServer.prototype.recomputePool = function () {
        this.pool = Array(globalsettings_js_1.HORSES_PER_RACE).fill(0);
        this.totalPool = 0;
        for (var _i = 0, _a = this.bets.values(); _i < _a.length; _i++) {
            var bet = _a[_i];
            this.pool[bet.horseIdx] += bet.betValue;
            this.totalPool += bet.betValue * 2;
        }
    };
    GameServer.prototype.notifyClientsOfBetResults = function () {
        for (var _i = 0, _a = this.clients.values(); _i < _a.length; _i++) {
            var client = _a[_i];
            var bet = this.bets.get(client.username);
            if (bet === undefined) {
                continue;
            }
            client.socket.emit('betResults', bet);
        }
    };
    GameServer.prototype.commitGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastRaceState, game;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Writing game results to database...');
                        if (this.race === null || this.raceStates === null) {
                            return [2 /*return*/];
                        }
                        lastRaceState = this.raceStates[this.raceStates.length - 1];
                        return [4 /*yield*/, GameLog_js_1.default.create({
                                horses: this.race.horses.map(function (h) { return h.spec._id; }),
                                results: {
                                    rankings: lastRaceState.rankings,
                                },
                            })];
                    case 1:
                        game = _a.sent();
                        console.log('Successfully wrote game log to database ');
                        // And then for each of the bets, commit the bet using the game
                        // log's id
                        return [4 /*yield*/, Promise.all(__spreadArray([], this.bets.entries(), true).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var client;
                                var user = _b[0], bet = _b[1];
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            client = this.clients.get(user);
                                            if (client) {
                                                if (bet.wentBankrupt) {
                                                    client.wallet = globalsettings_js_1.DEFAULT_WALLET;
                                                    client.bankruptcies += 1;
                                                }
                                                else {
                                                    client.wallet += bet.returns - bet.betValue;
                                                }
                                                this.emitClientStatus(client);
                                            }
                                            return [4 /*yield*/, bet.commit(game._id)];
                                        case 1:
                                            _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        // And then for each of the bets, commit the bet using the game
                        // log's id
                        _a.sent();
                        this.notifyClientsOfBetResults();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Start the main server loop.
    GameServer.prototype.startMainLoop = function () {
        var _this = this;
        this.prevTime = (0, time_js_1.hrTimeMs)();
        var cancel = false;
        this._loopCancelFunction = function () {
            cancel = true;
        };
        this.serverStatus = 'active';
        var runner = function () {
            if (cancel) {
                return;
            }
            setTimeout(runner, globalsettings_js_1.SERVER_TICK_RATE_MS / 4);
            // Some amount of time passed between the current and previous
            // calls to `runner`, so compute that and add it to lag.
            var now = (0, time_js_1.hrTimeMs)();
            _this.lag += now - _this.prevTime;
            _this.prevTime = now;
            var dirty = false;
            // While the server is still behind by at least the tick rate,
            // iteratively update the server and reduce the lag.
            // Additionally pass the current lag
            while (_this.lag > globalsettings_js_1.SERVER_TICK_RATE_MS) {
                _this.handleTick();
                _this.lag -= BigInt(globalsettings_js_1.SERVER_TICK_RATE_MS);
                dirty = true;
            }
            if (dirty) {
                _this.emitStateV1(_this.lag);
            }
            // Only broadcast v2 states if we are in race mode
            if (dirty && _this.raceStatus === 'race') {
                _this.broadcastStateV2(_this.lag);
            }
        };
        console.log('Starting main loop');
        runner();
    };
    GameServer.prototype.stopMainLoop = function () {
        if (this._loopCancelFunction === null) {
            return;
        }
        this._loopCancelFunction();
        this.serverStatus = 'inactive';
        console.log('Stopped main loop');
    };
    return GameServer;
}());
exports.GameServer = GameServer;
var gameServer = new GameServer();
console.log('created server');
exports.default = gameServer;
