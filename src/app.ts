import express from 'express'
import { createServer } from 'node:http'
import { GameServer } from './game/gameServer.js'
import { GameDatabase } from './game/gameDatabase.js'

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 3000

let db = GameDatabase.create()
let gameServer = new GameServer(db, server)

gameServer.mainLoop()

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})
