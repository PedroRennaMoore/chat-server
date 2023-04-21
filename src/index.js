import express from 'express'
import cors from 'cors'

import router from './routes.js'

class App {
    constructor() {
        this.app = express()
        this.PORT = process.env.PORT || 3001
        this.config()
        this.server()
        this.middleware()
    }

    config() {
        this.app.use(express.json())
        this.app.use(cors())
    }

    middleware() {
        this.app.use(router)
    }

    server() {
        this.app.listen(this.PORT, () => {
            console.log("listening on " + this.PORT)
        })
    }
}

new App()