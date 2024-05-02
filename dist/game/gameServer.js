import corsSettings from './../cors.js';
import { Server as SocketIOServer } from "socket.io";
import { ClientInfo } from "../clientInfo.js";
import { hrTimeMs } from "../time/time.js";
import { RaceState } from './raceState.js';
import { createRace } from './horse/localHorses.js';
import { BetInfo } from './betInfo.js';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../auth/secrets.js';
import GameLog from '../models/GameLog.js';
import { User } from '../models/User.js';
import { BETTING_DELAY, CHEAT_MODE, HORSES_PER_RACE, MINIMUM_BET, PRERACE_DELAY, RACE_LENGTH, RESULTS_DELAY, SERVER_TICK_RATE_MS } from '../config/globalsettings.js';
console.log(`Betting delay: ${BETTING_DELAY}`);
console.log(`Pre-race delay: ${PRERACE_DELAY}`);
console.log(`Results delay: ${RESULTS_DELAY}`);
const ServerInactiveError = {
    message: 'Server is inactive'
};
/** The base server for the game. */
export class GameServer {
    serverStatus = 'closed';
    /** Internal Socket.IO server. */
    io = null;
    /** Map between the Socket.IO ids of each client and a container
    *   for their client info */
    clients = new Map();
    bets = new Map();
    pool = [];
    totalPool = 0;
    messages = [];
    lag = 0n;
    prevTime = hrTimeMs();
    /** The current race, if it exists. */
    race = null;
    /** Current server status.
    * Betting - Race is visible to all players. Players may send 'bet' actions
    * to indicate that they will bet a certain amount on a horse to win.
    * Race - Race is being simulated.
    * Results - Race has finished, and the game server will simply display
    * the finished status. */
    raceStatus = 'betting';
    /** Timer that ticks down to zero in betting mode before a race begins. */
    bettingTimer = 0;
    bettingEndTimestamp = new Date();
    /** Timer that ticks down to zero in race mode before a race begins. */
    preRaceTimer = 0;
    preraceEndTimestamp = new Date();
    /** Timer that ticks down to zero in results mode before a new round begins. */
    resultsTimer = 0;
    resultsEndTimestamp = new Date();
    _loopCancelFunction = null;
    /** Array of all race states */
    raceStates = null;
    // TODO: add jsdocs
    createServer(server) {
        if (this.serverStatus !== 'closed') {
            throw { message: 'Server already created' };
        }
        console.log('Creating server...');
        // Create a new Socket.IO server using the given HTTP connection.
        this.io = new SocketIOServer(server, {
            cors: corsSettings
        });
        this.clients = new Map();
        this.messages = [];
        // For each client that connects to the server, set up the corresponding
        // event listeners.
        this.io.of('/user').use((socket, next) => (this.closedMiddleware(socket, next)));
        this.io.of('/user').use((socket, next) => (this.authMiddleware(socket, next)));
        this.io.of('/user').on('connection', (sk) => this.userHandler(sk));
        console.log('Server successfully created');
        this.openServer();
    }
    openServer() {
        this.serverStatus = 'inactive';
        this.startBettingMode();
        this.clients = new Map();
        console.log('Server is now open');
    }
    closeServer() {
        if (this.io === null) {
            throw { message: 'Server already closed' };
        }
        this.stopMainLoop();
        console.log('Disconnecting all clients...');
        this.io.of('/user').disconnectSockets();
        this.clients = new Map();
        this.serverStatus = 'closed';
        console.log('Server is now closed');
    }
    async closedMiddleware(_socket, next) {
        console.log('Handling inbound socket.');
        if (this.serverStatus === 'closed') {
            console.log('Rejected: server is closed');
            next(new Error('Server is closed, cannot connect'));
        }
        next();
    }
    async authMiddleware(socket, next) {
        console.log('Extracting socket\'s JWT.');
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.token;
        if (token === undefined) {
            console.log('Rejected: JWT was not provided');
            next(new Error('Must provide token in either auth or headers'));
            return;
        }
        let payload;
        try {
            payload = jwt.verify(token, jwtSecret);
        }
        catch (error) {
            next(new Error('Could not verify JWT.'));
            return;
        }
        if (typeof payload === 'string') {
            console.log('Rejected: JWT was not parsed correctly');
            next(new Error(`Could not parse JWT: ${payload}`));
            return;
        }
        if (payload.username === 'undefined') {
            console.log('Rejected: JWT is not in the correct format');
            next(new Error(`JWT has a bad payload`));
            return;
        }
        for (const clientName of this.clients.keys()) {
            if (clientName === payload.username) {
                next(new Error(`User already logged in`));
                return;
            }
        }
        let user;
        try {
            user = await User.findOne({ username: payload.username });
            if (!user) {
                console.log('Rejected: Could not find user in the database');
                next(new Error(`Could not find user ${payload.username}`));
                return;
            }
        }
        catch (error) {
            console.log('Rejected: Could not find user due to database error');
            next(new Error(`Could not retrieve user from database`));
            return;
        }
        socket.data = {
            username: payload.username,
            id: user._id,
            wallet: user.profile.wallet
        };
        console.log('Successfully authenticated the socket');
        console.log(socket.data);
        next();
    }
    userHandler(socket) {
        const clientInfo = new ClientInfo(socket);
        // Initially clients are unauthenticated. Clients may authenticate
        // themselves by sending a 'login' message to the server.
        this.clients.set(socket.data.username, clientInfo);
        // Set up socket middleware to log all inbound socket requests.
        socket.use(([event, ...args], next) => {
            console.log(`${socket.data.username}: (${event}) (${args})`);
            next();
        });
        // Client closed the connection.
        socket.on('disconnect', () => {
            this.clients.delete(socket.data.username);
        });
        // Client places a bet on a given horse
        socket.on('bet', ({ betValue, horseIdx }, res) => {
            let callback = res;
            if (callback === undefined) {
                callback = (payload) => {
                    socket.emit('debuglog', payload);
                };
            }
            if (this.raceStatus !== 'betting') {
                callback({
                    message: 'Not in betting mode'
                });
                return;
            }
            if (this.race === null) {
                callback({
                    message: 'No race has started'
                });
                return;
            }
            const currentBet = this.bets.get(clientInfo.username);
            if (currentBet !== undefined) {
                this.bets.delete(clientInfo.username);
            }
            if (betValue > clientInfo.wallet) {
                callback({
                    message: 'Not enough balance to make bet'
                });
                return;
            }
            if (!isFinite(betValue)) {
                callback({
                    message: 'Bet is an invalid numeric quantity'
                });
                return;
            }
            if (betValue < MINIMUM_BET) {
                callback({
                    message: `Bet must be at least ${MINIMUM_BET}`
                });
                return;
            }
            this.bets.set(clientInfo.username, new BetInfo({
                username: clientInfo.username,
                id: clientInfo.id,
                betValue: Math.floor(betValue),
                horseIdx: horseIdx,
                horseId: this.race.horses[horseIdx].spec._id,
            }));
            this.recomputePool();
            this.emitClientStatus(clientInfo);
            this.broadcastStateV2();
            callback({
                message: 'ok',
                betValue: betValue,
                horseIdx: horseIdx,
            });
        });
        // Player clears their bet
        socket.on('clearBet', (res) => {
            let callback = res;
            if (callback === undefined) {
                callback = (payload) => {
                    socket.emit('debuglog', payload);
                };
            }
            if (this.raceStatus !== 'betting') {
                res({
                    message: 'Not in betting mode'
                });
            }
            const currentBet = this.bets.get(clientInfo.username);
            if (currentBet !== undefined) {
                this.bets.delete(clientInfo.username);
            }
            this.recomputePool();
            this.emitClientStatus(clientInfo);
            this.broadcastStateV2();
            res({
                message: 'ok',
            });
        });
        console.log('Successfully set up event listeners');
        socket.emit('username', socket.data.username);
        this.emitClientStatus(clientInfo);
        this.broadcastStateV2();
    }
    emitClientStatus(client) {
        let payload = {
            username: client.username,
            id: client.id,
            wallet: client.wallet,
            bet: null
        };
        const bet = this.bets.get(client.username);
        if (bet !== undefined) {
            payload.bet = {
                betValue: bet.betValue,
                horseIdx: bet.horseIdx,
            };
        }
        client.socket.emit('clientStatus', payload);
    }
    startBettingMode() {
        console.log('Entering betting mode');
        this.raceStatus = 'betting';
        this.race = createRace();
        console.log(this.race?.weatherConditions);
        this.bettingTimer = BETTING_DELAY * 1000;
        this.bettingEndTimestamp = new Date(Date.now() + BETTING_DELAY * 1000);
        this.raceStates = null;
        this.bets = new Map();
        this.pool = Array(HORSES_PER_RACE).fill(0);
        this.totalPool = 0;
        for (const client of this.clients.values()) {
            this.emitClientStatus(client);
        }
        this.broadcastStateV2();
    }
    startRaceMode() {
        console.log('Entering race mode');
        this.raceStatus = 'race';
        this.preRaceTimer = PRERACE_DELAY * 1000;
        this.preraceEndTimestamp = new Date(Date.now() + PRERACE_DELAY * 1000);
        if (this.race === null) {
            throw new Error('no race');
        }
        this.recomputePool();
        console.log(`Current pool: ${this.pool}`);
        console.log(`Total: ${this.totalPool}`);
        this.raceStates = [new RaceState(this.race)];
        // If cheat mode is enabled, always put horses at the end
        if (CHEAT_MODE) {
            this.raceStates[0].horseStates[0].position = RACE_LENGTH - 1;
        }
        this.broadcastStateV2();
    }
    startResultsMode() {
        console.log('Entering results mode');
        this.raceStatus = 'results';
        this.resultsTimer = RESULTS_DELAY * 1000;
        this.resultsEndTimestamp = new Date(Date.now() + RESULTS_DELAY * 1000);
        if (this.raceStates === null) {
            throw new Error('Could not enter results mode');
        }
        // Get the end state of the race
        const lastState = this.raceStates[this.raceStates.length - 1];
        for (const bet of this.bets.values()) {
            // For each player who bet on the winning horse, pay them the total pool times the fraction they put on a given horse
            if (bet.horseIdx === lastState.rankings[0]) {
                bet.returns = this.totalPool * Math.floor(bet.betValue / this.pool[bet.horseIdx]);
            }
            console.log(`Player ${bet.username} ${(bet.returns > 0) ? 'receives' : 'loses'} ${Math.abs(bet.returns - bet.betValue)} from their bet on horse ${bet.horseIdx + 1}`);
        }
        // do persistence stuff
        this.commitGame();
        this.broadcastStateV2();
    }
    handleTick() {
        switch (this.raceStatus) {
            case 'betting':
                if (this.bettingTimer > 0) {
                    this.bettingTimer -= SERVER_TICK_RATE_MS;
                    return;
                }
                this.startRaceMode();
                return;
            case 'race':
                if (this.preRaceTimer > 0) {
                    this.preRaceTimer -= SERVER_TICK_RATE_MS;
                    return;
                }
                // Otherwise, compute the next state and add it to the
                // list of race states in memory
                if (this.raceStates === null) {
                    throw new Error('no race states');
                }
                const currentState = this.raceStates[this.raceStates.length - 1];
                if (currentState.raceOver()) {
                    this.startResultsMode();
                    return;
                }
                if (this.race === null) {
                    throw new Error('no race');
                }
                const nextState = currentState.nextState(this.race);
                this.raceStates.push(nextState);
                break;
            case 'results':
                if (this.resultsTimer > 0) {
                    this.resultsTimer -= SERVER_TICK_RATE_MS;
                    return;
                }
                // start a new race if we're autorestarting
                this.startBettingMode();
                break;
        }
    }
    // HorseState and horseState need to be replaced with the actual HorseState
    generateCommentary() {
        const comments = [];
        if (!this.race || !this.race.horseStates) {
            return comments; // Return empty if no race or horseStates is undefined
        }
        this.race.horseStates.forEach((horseState, index) => {
            if (horseState.finishTime !== null) {
                comments.push(`Horse ${index + 1} finishes the race!`);
            }
            else {
                comments.push(`Horse ${index + 1} at position ${horseState.position.toFixed(2)} moving at speed ${horseState.currentSpeed.toFixed(2)}.`);
            }
            this.race.horseStates.forEach((otherHorseState, otherIndex) => {
                if (index !== otherIndex && horseState.position > otherHorseState.position && horseState.position - horseState.currentSpeed <= otherHorseState.position) {
                    comments.push(`Horse ${index + 1} overtakes Horse ${otherIndex + 1}!`);
                }
            });
        });
        return comments;
    }
    broadcastStateV2(lag) {
        if (this.io === null) {
            return;
        }
        if (this.race === null) {
            return;
        }
        let currLag = lag;
        if (currLag === undefined) {
            const now = hrTimeMs();
            currLag = this.lag + (now - this.prevTime);
        }
        let payload;
        const general = {
            numClients: this.clients.size,
            lag: Number(currLag),
            race: {
                horses: this.race.horses.map((h) => ({
                    horseName: h.spec.name,
                    horseId: h.spec._id.toString(),
                    horseColor: h.spec.color,
                    horseIcons: h.spec.icons,
                })),
                raceLength: this.race.length,
                weatherConditions: this.race.weatherConditions?.name || 'Clear',
            },
            currentPoolValue: this.totalPool,
            minimumBet: MINIMUM_BET,
        };
        switch (this.raceStatus) {
            case 'betting': {
                payload = {
                    ...general,
                    status: 'betting',
                    raceStartTime: this.bettingEndTimestamp,
                };
                break;
            }
            case 'race': {
                if (this.raceStates === null) {
                    return;
                }
                const lastState = this.raceStates[this.raceStates.length - 1];
                payload = {
                    ...general,
                    status: 'race',
                    preraceStartTime: (this.preRaceTimer > 0)
                        ? undefined : this.preraceEndTimestamp,
                    eventMessages: this.messages,
                    raceState: {
                        horseStates: lastState.horseStates.map((hs) => ({
                            position: hs.position,
                            speed: hs.currentSpeed,
                            isFinished: hs.finishTime !== null,
                            finishTime: (hs.finishTime !== null) ? hs.finishTime : undefined,
                        })),
                        rankings: lastState.rankings,
                    },
                };
                break;
            }
            case 'results': {
                if (this.raceStates === null) {
                    return;
                }
                const lastState = this.raceStates[this.raceStates.length - 1];
                payload = {
                    ...general,
                    status: 'results',
                    nextRaceStartTime: this.resultsEndTimestamp,
                    rankings: lastState.rankings,
                    finishTimes: lastState.horseStates.map((hs) => hs.finishTime),
                };
                break;
            }
        }
        this.io.of('/user').emit('gamestatev2', payload);
    }
    emitStateV1(lag) {
        if (this.io === null) {
            throw ServerInactiveError;
        }
        switch (this.raceStatus) {
            case 'betting':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: [...this.clients.keys()],
                    messages: this.messages,
                    lag: Number(lag),
                    race: this.race,
                    bettingTimer: this.bettingTimer
                });
                break;
            case 'race':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: [...this.clients.keys()],
                    messages: this.messages,
                    lag: Number(lag),
                    preRaceTimer: this.preRaceTimer,
                    raceStates: (this.raceStates === null)
                        ? null
                        : this.raceStates[this.raceStates.length - 1]
                });
                break;
            case 'results':
                this.io.of('/user').emit('gamestate', {
                    status: this.raceStatus,
                    clients: [...this.clients.keys()],
                    messages: this.messages,
                    lag: Number(lag),
                    resultsTimer: this.resultsTimer,
                    raceStates: (this.raceStates === null)
                        ? null
                        : this.raceStates[this.raceStates.length - 1]
                });
                break;
        }
    }
    recomputePool() {
        this.pool = Array(HORSES_PER_RACE).fill(0);
        this.totalPool = 0;
        for (const bet of this.bets.values()) {
            this.pool[bet.horseIdx] += bet.betValue;
            this.totalPool += bet.betValue * 2;
        }
    }
    notifyClientsOfBetResults() {
        for (const client of this.clients.values()) {
            const bet = this.bets.get(client.username);
            if (bet === undefined) {
                continue;
            }
            client.socket.emit('betResults', bet);
        }
    }
    async commitGame() {
        console.log('Writing game results to database...');
        if (this.race === null || this.raceStates === null) {
            return;
        }
        const lastRaceState = this.raceStates[this.raceStates.length - 1];
        // Create a game log object in the database
        const game = await GameLog.create({
            horses: this.race.horses.map((h) => h.spec._id),
            results: {
                rankings: lastRaceState.rankings
            }
        });
        console.log('Successfully wrote game log to database ');
        // And then for each of the bets, commit the bet using the game
        // log's id
        await Promise.all([...this.bets.entries()].map(async ([user, bet]) => {
            // Update local wallet for each connected client
            const client = this.clients.get(user);
            if (client) {
                client.wallet += bet.returns - bet.betValue;
                this.emitClientStatus(client);
            }
            await bet.commit(game._id);
        }));
        this.notifyClientsOfBetResults();
    }
    // Start the main server loop.
    startMainLoop() {
        this.prevTime = hrTimeMs();
        let cancel = false;
        this._loopCancelFunction = () => { cancel = true; };
        this.serverStatus = 'active';
        const runner = () => {
            if (cancel) {
                return;
            }
            setTimeout(runner, SERVER_TICK_RATE_MS / 4);
            // Some amount of time passed between the current and previous
            // calls to `runner`, so compute that and add it to lag.
            const now = hrTimeMs();
            this.lag += now - this.prevTime;
            this.prevTime = now;
            let dirty = false;
            // While the server is still behind by at least the tick rate,
            // iteratively update the server and reduce the lag.
            // Additionally pass the current lag 
            while (this.lag > SERVER_TICK_RATE_MS) {
                this.handleTick();
                this.lag -= BigInt(SERVER_TICK_RATE_MS);
                dirty = true;
            }
            if (dirty) {
                this.emitStateV1(this.lag);
            }
            // Only broadcast v2 states if we are in race mode
            if (dirty && this.raceStatus === 'race') {
                this.broadcastStateV2(this.lag);
            }
        };
        console.log('Starting main loop');
        runner();
    }
    stopMainLoop() {
        if (this._loopCancelFunction === null) {
            return;
        }
        this._loopCancelFunction();
        this.serverStatus = 'inactive';
        console.log('Stopped main loop');
    }
}
const gameServer = new GameServer();
console.log('created server');
export default gameServer;
