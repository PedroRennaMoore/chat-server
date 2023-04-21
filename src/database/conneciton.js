import mysql2 from 'mysql2'
import { database } from './config.js'

const connection = mysql2.createPool({
    host: database.url,
    user: database.user,
    password: database.password,
    database: database.name,
    waitForConnections: true,
    connectionLimit: 0,
    queueLimit: 0
})

export default connection