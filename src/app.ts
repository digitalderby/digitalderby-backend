import express from 'express'
import { createServer } from 'node:http'
import { GameServer } from './game/gameServer.js'
import { GameDatabase } from './game/gameDatabase.js'

import HorseRouter from './routes/horses.js'
import UserRouter from './routes/users.js'
import AdminRouter from './routes/admin.js'
import RaceRouter from './routes/races.js'
import HttpInterfaceRouter from './routes/http.js'

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 3000

let db = GameDatabase.create()
let gameServer = new GameServer(db, server)

app.use('/horses', HorseRouter)
app.use('/users', UserRouter)
app.use('/admin', AdminRouter)
app.use('/races', RaceRouter)
app.use('/http', HttpInterfaceRouter)

gameServer.mainLoop()

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})
