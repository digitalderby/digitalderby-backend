import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import gameServer from './game/gameServer.js'

import './config/database.js'

import cors from 'cors'
import corsSettings from './cors.js'
import logger from 'morgan'

import AdminRouter from './routes/admin.js'
import AuthRouter from './routes/auth.js'
import HorseRouter from './routes/horses.js'
import UserRouter from './routes/users.js'
import RaceRouter from './routes/races.js'
import HttpInterfaceRouter from './routes/http.js'
import bodyParser from 'body-parser'

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { AUTOSTART } from './config/globalsettings.js'

import minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

export const args = {
    readOnly: false,
}

if (argv['read-only']) {
    console.log('Read-only mode enabled')
    args.readOnly = true
}

const app = express()
export const server = createServer(app)

const PORT = process.env.PORT || 3000


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

const swaggerOptions = {
    swaggerOptions: {
        supportedSubmitMethods: [],
    }
}

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(YAML.load('./api-docs.yaml'), swaggerOptions)
)

gameServer.createServer(server)

if (AUTOSTART) {
    gameServer.startMainLoop()
}

server.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`)
    console.log(`Access api documentation at http://localhost:${PORT}/api-docs`)
})
