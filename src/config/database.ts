import 'dotenv/config.js'
import mongoose from 'mongoose'

const db = mongoose.connection
const opts = {
}

if (process.env.DATABASE_URI === undefined) {
    throw new Error('Database not defined in the .env file- cannot run.')
}

console.log('Connecting to MongoDB instance...')
mongoose.connect(process.env.DATABASE_URI)

db.on('connected', () => {
    console.log(`Successfully connected to MongoDB ${db.name} at ${db.host}:${db.port}.`)
})

export default db
