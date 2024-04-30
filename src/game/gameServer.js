"use strict";
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
exports.GameServer = exports.DEFAULT_WALLET = exports.RESULTS_DELAY = exports.PRERACE_DELAY = exports.BETTING_DELAY = exports.SERVER_TICK_RATE_MS = void 0;
var socket_io_1 = require("socket.io");
var gameDatabase_js_1 = require("./gameDatabase.js");
var time_js_1 = require("../time/time.js");
var raceState_js_1 = require("./raceState.js");
exports.SERVER_TICK_RATE_MS = 100;
exports.BETTING_DELAY = 10;
exports.PRERACE_DELAY = 3;
exports.RESULTS_DELAY = 10;
exports.DEFAULT_WALLET = 100;
var ServerInactiveError = {
    message: 'Server is inactive'
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
        this.status = 'betting';
        /** Timer that ticks down to zero in betting mode before a race begins. */
        this.bettingTimer = 0;
        /** Timer that ticks down to zero in race mode before a race begins. */
        this.preRaceTimer = 0;
        /** Timer that ticks down to zero in results mode before a new round begins. */
        this.resultsTimer = 0;
        this._loopCancelFunction = null;
        this._pauseFunction = null;
        /** Array of all race states */
        this.raceStates = null;
    }
    GameServer.prototype.createServer = function (server) {
        var _this = this;
        if (this.serverStatus !== 'closed') {
            throw { message: 'Server already created' };
        }
        console.log('creating server');
        // Create a new Socket.IO server using the given HTTP connection.
        this.io = new socket_io_1.Server(server, {
            cors: {
                credentials: true,
                origin: [
                    // Vite React default origin
                    'http://localhost:5173'
                    // ... other origins here...
                ]
            }
        });
        this.clients = new Map();
        this.messages = [];
        // For each client that connects to the server, set up the corresponding
        // event listeners.
        this.io.of('/').on('connection', function (sk) { return _this.userHandler(sk); });
        this.serverStatus = 'inactive';
        this.startBettingMode();
    };
    GameServer.prototype.closeServer = function () {
        if (this.io === null) {
            throw { message: 'Server already closed' };
        }
        this.stopMainLoop();
        this.io.close();
        this.serverStatus = 'closed';
    };
    GameServer.prototype.guestHandler = function (socket) {
        var _this = this;
        console.log('a user connected');
        console.log(socket);
        // Initially clients are unauthenticated. Clients may authenticate
        // themselves by sending a 'login' message to the server.
        this.clients.set(socket.id, {
            socket: socket,
            authed: false,
            username: ''
        });
        // Log all events as they come in.
        socket.onAny(function (evt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return console.log(evt, args);
        });
        // Client attempted to login.
        socket.on('login', function (_a, cb) {
            var username = _a.username;
            var clientInfo = _this.clients.get(socket.id);
            // If client doesn't exist somehow, inform client that
            // their info isn't in the list of clients in the server.
            if (clientInfo === undefined) {
                cb({
                    message: 'not in client listing'
                });
                return;
            }
            clientInfo.authed = true;
            clientInfo.username = username;
            // Inform user that authentication was successful
            cb({
                message: 'ok'
            });
        });
        // Client attempted to logout.
        socket.on('logout', function () {
            var clientInfo = _this.clients.get(socket.id);
            if (clientInfo === undefined) {
                return;
            }
            clientInfo.authed = false;
            clientInfo.username = '';
        });
        // Client closed the connection.
        socket.on('disconnect', function () {
            _this.clients.delete(socket.id);
        });
        // Client sent an action to the server.
        socket.on('action', function (payload) {
            _this.handleAction(payload);
        });
    };
    GameServer.prototype.userHandler = function (socket) {
        var _this = this;
        console.log('a user connected');
        console.log(socket);
        // Initially clients are unauthenticated. Clients may authenticate
        // themselves by sending a 'login' message to the server.
        this.clients.set(socket.id, {
            socket: socket,
            authed: false,
            username: ''
        });
        // Log all events as they come in.
        socket.onAny(function (evt) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return console.log(evt, args);
        });
        // Client attempted to login.
        socket.on('login', function (_a, cb) {
            var username = _a.username;
            var clientInfo = _this.clients.get(socket.id);
            // If client doesn't exist somehow, inform client that
            // their info isn't in the list of clients in the server.
            if (clientInfo === undefined) {
                cb({
                    message: 'not in client listing'
                });
                return;
            }
            clientInfo.authed = true;
            clientInfo.username = username;
            // Inform user that authentication was successful
            cb({
                message: 'ok'
            });
        });
        // Client attempted to logout.
        socket.on('logout', function () {
            var clientInfo = _this.clients.get(socket.id);
            if (clientInfo === undefined) {
                return;
            }
            clientInfo.authed = false;
            clientInfo.username = '';
        });
        // Client closed the connection.
        socket.on('disconnect', function () {
            _this.clients.delete(socket.id);
        });
        // Client sent an action to the server.
        socket.on('action', function (payload) {
            _this.handleAction(payload);
        });
    };
    GameServer.prototype.startBettingMode = function () {
        this.status = 'betting';
        this.race = gameDatabase_js_1.default.createRace();
        this.bettingTimer = exports.BETTING_DELAY * 1000;
        this.raceStates = null;
    };
    GameServer.prototype.startRaceMode = function () {
        this.status = 'race';
        this.preRaceTimer = exports.PRERACE_DELAY * 1000;
        if (this.race === null) {
            throw new Error('no race');
        }
        this.raceStates = [new raceState_js_1.RaceState(this.race)];
    };
    GameServer.prototype.startResultsMode = function () {
        this.status = 'results';
        this.resultsTimer = exports.RESULTS_DELAY * 1000;
    };
    GameServer.prototype.handleAction = function (payload) {
        console.log(payload);
    };
    GameServer.prototype.handleTick = function () {
        switch (this.status) {
            case 'betting':
                if (this.bettingTimer > 0) {
                    this.bettingTimer -= exports.SERVER_TICK_RATE_MS;
                    return;
                }
                this.startRaceMode();
                return;
            case 'race':
                if (this.preRaceTimer > 0) {
                    this.preRaceTimer -= exports.SERVER_TICK_RATE_MS;
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
                var nextState = currentState.nextState();
                this.raceStates.push(nextState);
                break;
            case 'results':
                if (this.resultsTimer > 0) {
                    this.resultsTimer -= exports.SERVER_TICK_RATE_MS;
                    return;
                }
                // start a new race if we're autorestarting
                break;
        }
    };
    GameServer.prototype.emitState = function (lag) {
        if (this.io === null) {
            throw ServerInactiveError;
        }
        switch (this.status) {
            case 'betting':
                this.io.emit('gamestate', {
                    status: this.status,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag) - exports.SERVER_TICK_RATE_MS,
                    race: this.race,
                    bettingTimer: this.bettingTimer
                });
                break;
            case 'race':
                this.io.emit('gamestate', {
                    status: this.status,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag) - exports.SERVER_TICK_RATE_MS,
                    preRaceTimer: this.preRaceTimer,
                    raceStates: (this.raceStates === null)
                        ? null
                        : this.raceStates[this.raceStates.length - 1]
                });
                break;
            case 'results':
                this.io.emit('gamestate', {
                    status: this.status,
                    clients: __spreadArray([], this.clients.keys(), true),
                    messages: this.messages,
                    lag: Number(lag) - exports.SERVER_TICK_RATE_MS,
                    resultsTimer: this.resultsTimer,
                    raceStates: (this.raceStates === null)
                        ? null
                        : this.raceStates[this.raceStates.length - 1]
                });
                break;
        }
    };
    // Start the main server loop.
    GameServer.prototype.startMainLoop = function () {
        var _this = this;
        this.prevTime = (0, time_js_1.hrTimeMs)();
        var cancel = false;
        this.serverStatus = 'active';
        var runner = function () {
            if (cancel) {
                return;
            }
            setTimeout(runner, exports.SERVER_TICK_RATE_MS / 4);
            // Some amount of time passed between the current and previous
            // calls to `runner`, so compute that and add it to lag.
            var now = (0, time_js_1.hrTimeMs)();
            _this.lag += now - _this.prevTime;
            _this.prevTime = now;
            var dirty = false;
            // While the server is still behind by at least the tick rate,
            // iteratively update the server and reduce the lag.
            // Additionally pass the current lag 
            while (_this.lag > exports.SERVER_TICK_RATE_MS) {
                _this.handleTick();
                _this.lag -= BigInt(exports.SERVER_TICK_RATE_MS);
                dirty = true;
                console.log(_this.lag);
            }
            if (dirty) {
                _this.emitState(_this.lag);
            }
        };
        runner();
    };
    GameServer.prototype.stopMainLoop = function () {
        if (this._loopCancelFunction === null) {
            return;
        }
        this._loopCancelFunction();
        this.serverStatus = 'inactive';
    };
    return GameServer;
}());
exports.GameServer = GameServer;
var gameServer = new GameServer();
console.log('created server');
exports.default = gameServer;
