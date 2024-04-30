import { Server as HTTPServer } from 'node:http'
import { Socket, Server as SocketIOServer } from "socket.io"
import { ClientInfo } from "../clientInfo.js"
import { hrTimeMs } from "../time/time.js"
import { RACE_DURATION, Race } from './race.js'
import { RaceState } from './raceState.js'
import { HORSES_PER_RACE, createRace } from './horse/localHorses.js'
import { BetInfo } from './betInfo.js'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../auth/secrets.js'
import { server } from '../app.js'
import GameLog from '../models/GameLog.js'

export const SERVER_TICK_RATE_MS = 100

export const BETTING_DELAY = 15
export const PRERACE_DELAY = 3
export const RESULTS_DELAY = 10

export const DEFAULT_WALLET = 100

const ServerInactiveError = {
    message: 'Server is inactive'
}

/** The base server for the game. */
export class GameServer {
    serverStatus: 'active' | 'inactive' | 'closed' = 'closed'
    /** Internal Socket.IO server. */
    io: SocketIOServer | null = null
    /** Map between the Socket.IO ids of each client and a container
    *   for their client info */
    clients: Map<string, ClientInfo> = new Map()
    bets: Map<string, BetInfo> = new Map()
    pool: number[] = []
    totalPool: number = 0

    messages: Array<string> = []

    lag: bigint = 0n
    prevTime: bigint = hrTimeMs()

    /** The current race, if it exists. */
    race: Race | null = null
    /** Current server status.
    * Betting - Race is visible to all players. Players may send 'bet' actions
    * to indicate that they will bet a certain amount on a horse to win.
    * Race - Race is being simulated.
    * Results - Race has finished, and the game server will simply display
    * the finished status. */
    raceStatus: 'betting' | 'race' | 'results' = 'betting'

    /** Timer that ticks down to zero in betting mode before a race begins. */
    bettingTimer: number = 0
    /** Timer that ticks down to zero in race mode before a race begins. */
    preRaceTimer: number = 0
    /** Timer that ticks down to zero in results mode before a new round begins. */
    resultsTimer: number = 0

    _loopCancelFunction: (() => void) | null = null

    /** Array of all race states */
    raceStates: Array<RaceState> | null = null

    createServer(server: HTTPServer) {
        if (this.serverStatus !== 'closed') { throw { message: 'Server already created' } }

        console.log('creating server')
        // Create a new Socket.IO server using the given HTTP connection.
        this.io = new SocketIOServer(server, {
            cors: {
                credentials: true,
                origin: [
                    // Vite React default origin
                    'http://localhost:5173'

                    // ... other origins here...
                ]
            }
        })

        this.clients = new Map()
        this.messages = []

        // For each client that connects to the server, set up the corresponding
        // event listeners.
        this.io.of('/user').use((socket, next) => (this.authMiddleware(socket, next)))

        this.io.of('/user').on('connection', (sk) => this.userHandler(sk))
        this.serverStatus = 'inactive'

        this.startBettingMode()
    }

    closeServer() {
        if (this.io === null) { throw { message: 'Server already closed' } }
        this.stopMainLoop()

        this.io.close()
        this.serverStatus = 'closed'
    }

    authMiddleware(socket: Socket, next: (err?: Error | undefined) => void) {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.token
        if (token === undefined) {
            next(new Error('Must provide token in either auth or headers'))
            return
        }

        const payload = jwt.verify(token, jwtSecret)

        if (typeof payload === 'string') {
            next(new Error(`Could not parse JWT: ${payload}`))
            return
        }

        if (payload.username === 'undefined') {
            next(new Error(`JWT has a bad payload`))
            return
        }

        socket.data = { username: payload.username }
        next()
    }
    
    userHandler(socket: Socket) {
        console.log('in user handler')
        // Initially clients are unauthenticated. Clients may authenticate
        // themselves by sending a 'login' message to the server.
        this.clients.set(socket.id, {
            socket: socket,
            username: socket.data.username
        })

        // Log all events as they come in.
        socket.onAny((evt, ...args) => console.log(evt, args))

        // Client closed the connection.
        socket.on('disconnect', () => {
            this.clients.delete(socket.id)
        })

        // Client places a bet on a given horse
        socket.on('bet', ({ betValue, horseIdx }, res) => {
            let callback = res
            if (callback === undefined) {
                callback = (payload: any) => {
                    socket.emit('debuglog', payload)
                }
            }

            let clientInfo = this.clients.get(socket.id)
            if (clientInfo === undefined) {
                callback({
                    message: 'Not in client listing'
                })
                return
            }

            if (this.raceStatus !== 'betting') {
                callback({
                    message: 'Not in betting mode'
                })
            }

            const currentBet = this.bets.get(clientInfo.username)
            if (currentBet !== undefined) {
                this.bets.delete(clientInfo.username)
                this.pool[currentBet.horseIdx] -= currentBet.betValue
            } 

            this.bets.set(clientInfo.username, {
                betValue: betValue,
                horseIdx: horseIdx,
                returns: 0,
            })
            this.pool[horseIdx] += betValue

            callback({
                message: 'ok',
                betValue: betValue,
                horseIdx: horseIdx,
            })
        })

        // Player clears their bet
        socket.on('clearBet', (res) => {
            let callback = res
            if (callback === undefined) {
                callback = (payload: any) => {
                    socket.emit('debuglog', payload)
                }
            }

            let clientInfo = this.clients.get(socket.id)
            if (clientInfo === undefined) {
                res({
                    message: 'Not in client listing'
                })
                return
            }

            if (this.raceStatus !== 'betting') {
                res({
                    message: 'Not in betting mode'
                })
            }

            const currentBet = this.bets.get(clientInfo.username)
            if (currentBet !== undefined) {
                this.bets.delete(clientInfo.username)
                this.pool[currentBet.horseIdx] -= currentBet.betValue
            } 

            res({
                message: 'ok',
            })
        })

        console.log('emitting', socket.data.username)
        socket.emit('username', socket.data.username)
    }

    startBettingMode() {
        this.raceStatus = 'betting'
        this.race = createRace()
        this.bettingTimer = BETTING_DELAY * 1000
        this.raceStates = null

        this.bets = new Map()
        this.pool = Array(HORSES_PER_RACE).fill(0)
        this.totalPool = 0
    }

    startRaceMode() {
        this.raceStatus = 'race'
        this.preRaceTimer = PRERACE_DELAY * 1000
        if (this.race === null) { throw new Error('no race') }

        for (let i = 0; i < HORSES_PER_RACE; i++) {
            this.totalPool += this.pool[i] * 2
        }

        console.log(`Current pool: ${this.pool}`)
        console.log(`Total: ${this.totalPool}`)

        this.raceStates = [new RaceState(this.race)]
        this.raceStates[0].horseStates[0].position = RACE_DURATION-1
    }

    startResultsMode() {
        this.raceStatus = 'results'
        this.resultsTimer = RESULTS_DELAY * 1000

        if (this.raceStates === null) { throw new Error('Could not enter results mode') }

        // Get the end state of the race
        const lastState = this.raceStates[this.raceStates.length-1]
        for (const bet of this.bets.values()) {
            // If we bet on the winning horse, get paid (total pool/pool in
            // winning horse) for every dollar bet
            if (bet.horseIdx === lastState.rankings[0]) {
                bet.returns = bet.betValue * (this.totalPool/this.pool[bet.horseIdx])
            }
        }

        // do persistence stuff

        this.notifyClientsOfBetResults()
    }

    handleAction(payload: any) {
        console.log(payload)
    }

    handleTick(): void {
        switch(this.raceStatus) {
        case 'betting':
            if (this.bettingTimer > 0) {
                this.bettingTimer -= SERVER_TICK_RATE_MS
                return
            }

            this.startRaceMode()
            return
        case 'race':
            if (this.preRaceTimer > 0) {
                this.preRaceTimer -= SERVER_TICK_RATE_MS
                return
            }

            // Otherwise, compute the next state and add it to the
            // list of race states in memory
            if (this.raceStates === null) { throw new Error('no race states') }
            const currentState = this.raceStates[this.raceStates.length-1]

            if (currentState.raceOver()) {
                this.startResultsMode()
                return
            }

            const nextState = currentState.nextState()
            this.raceStates.push(nextState)
            break;
        case 'results':
            if (this.resultsTimer > 0) {
                this.resultsTimer -= SERVER_TICK_RATE_MS
                return
            }

            // start a new race if we're autorestarting
            this.startBettingMode()
            break;
        }
    }

    emitState(lag: bigint): void {
        if (this.io === null) { throw ServerInactiveError }

        switch(this.raceStatus) {
        case 'betting':
            this.io.of('/user').emit('gamestate', {
                status: this.raceStatus,
                clients: [...this.clients.keys()],
                messages: this.messages,
                lag: Number(lag),

                race: this.race,
                bettingTimer: this.bettingTimer
            })
            break;
        case 'race':
            this.io.of('/user').emit('gamestate', {
                status: this.raceStatus,
                clients: [...this.clients.keys()],
                messages: this.messages,
                lag: Number(lag),

                preRaceTimer: this.preRaceTimer,
                raceStates:
                    (this.raceStates === null)
                    ? null
                    : this.raceStates[this.raceStates.length-1]
            })
            break;
        case 'results':
            this.io.of('/user').emit('gamestate', {
                status: this.raceStatus,
                clients: [...this.clients.keys()],
                messages: this.messages,
                lag: Number(lag),

                resultsTimer: this.resultsTimer,
                raceStates:
                    (this.raceStates === null)
                    ? null
                    : this.raceStates[this.raceStates.length-1]
            })
            break;
        }
    }

    notifyClientsOfBetResults(): void {
        for (const client of this.clients.values()) {
            const bet = this.bets.get(client.username)
            if (bet === undefined) { continue }
            client.socket.emit('betResults', bet)
        }
    }

    async commitGame(): Promise<void> {
        if (this.race === null || this.raceStates === null) { return }
        const lastRaceState = this.raceStates[this.raceStates.length-1]

        // Create a game log object in the database
        const game = await GameLog.create({
            horses: this.race.horses.map((h) => h.spec._id),
            results: {
                rankings: lastRaceState.rankings
            }
        })

        // And then for each of the bets, commit the bet using the game
        // log's id
        await Promise.all(
            [...this.bets.values()].map(async (bet) => {
                await bet.commit(game._id) 
            })
        )
    }

    // Start the main server loop.
    startMainLoop() {
        this.prevTime = hrTimeMs()
        let cancel = false
        this._loopCancelFunction = () => { cancel = true }

        this.serverStatus = 'active'

        const runner = () => {
            if (cancel) { return }

            setTimeout(runner, SERVER_TICK_RATE_MS/4)
            // Some amount of time passed between the current and previous
            // calls to `runner`, so compute that and add it to lag.
            const now = hrTimeMs()
            this.lag += now - this.prevTime
            this.prevTime = now
            let dirty = false
            // While the server is still behind by at least the tick rate,
            // iteratively update the server and reduce the lag.
            // Additionally pass the current lag 
            while (this.lag > SERVER_TICK_RATE_MS) {
                this.handleTick()
                this.lag -= BigInt(SERVER_TICK_RATE_MS)
                dirty = true
            }

            if (dirty) {
                this.emitState(this.lag)
            }
        }

        runner()
    }

    stopMainLoop() {
        if (this._loopCancelFunction === null) { return }
        this._loopCancelFunction()
        this.serverStatus = 'inactive'
    }
}

const gameServer = new GameServer()

console.log('created server')

export default gameServer
