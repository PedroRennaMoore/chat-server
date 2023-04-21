import 'dotenv/config.js'

export const database = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_SECRET,
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME
}
