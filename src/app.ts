import express from 'express'
import { createServer } from 'node:http'
import { GameServer } from './game/gameServer.js'
import { GameDatabase } from './game/gameDatabase.js'

import cors from 'cors'
import logger from 'morgan'

import HorseRouter from './routes/horses.js'
import UserRouter from './routes/users.js'
import AdminRouter from './routes/admin.js'
import RaceRouter from './routes/races.js'
import HttpInterfaceRouter from './routes/http.js'
import bodyParser from 'body-parser'

const app = express()
const server = createServer(app)

const PORT = process.env.PORT || 3000

const corsSettings = {
    credentials: true,
    origin: [
        'http://localhost:5173',
    ]
}

let db = GameDatabase.create()
let gameServer = new GameServer(db, server)

app.use(logger('dev'))
app.use(cors(corsSettings))
app.use(bodyParser.json())

app.get('/', (_req, res) => {
    res.json({message: "this is the index route, the server is working"})
})

app.use('/horses', HorseRouter)
app.use('/users', UserRouter)
app.use('/admin', AdminRouter)
app.use('/races', RaceRouter)
app.use('/http', HttpInterfaceRouter)

gameServer.mainLoop()

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})
