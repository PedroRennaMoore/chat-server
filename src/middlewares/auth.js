import jwt from 'jsonwebtoken'
import "dotenv/config"
import {promisify} from 'util'

export const TokenAuth = async(req, res, next ) => {

    const authHeader = req.headers.authorization

    if(!authHeader) {
        return res.status(401).json("Token was not provided")
    }

    const [, token] = authHeader.split(" ")

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)
        req.userId = decoded
        next()
    } catch (error) {
        return res.status(401).json({erro: "Token is invalid"})
    }
}