import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import gameServer from './game/gameServer.js'
import gameDatabase from './game/gameDatabase.js'

import './config/database.js'

import cors from 'cors'
import logger from 'morgan'

import AdminRouter from './routes/admin.js'
import AuthRouter from './routes/auth.js'
import HorseRouter from './routes/horses.js'
import UserRouter from './routes/users.js'
import RaceRouter from './routes/races.js'
import HttpInterfaceRouter from './routes/http.js'
import bodyParser from 'body-parser'

import minimist from 'minimist'

export const args = minimist(process.argv.slice(2))

if (args['read-only']) {
    console.log('Read-only mode enabled')
}

const app = express()
export const server = createServer(app)

const PORT = process.env.PORT || 3000

const corsSettings = {
    credentials: true,
    origin: [
        'http://localhost:5173',
    ]
}


app.use(logger('dev'))
app.use(cors(corsSettings))
app.use(bodyParser.json())

app.get('/', (_req, res) => {
    res.json({message: "this is the index route, the server is working"})
})

app.use('/admin', AdminRouter)
app.use('/auth', AuthRouter)
app.use('/horses', HorseRouter)
app.use('/users', UserRouter)
app.use('/races', RaceRouter)
app.use('/http', HttpInterfaceRouter)

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
})
