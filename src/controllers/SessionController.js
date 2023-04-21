import jwt from "jsonwebtoken"
import "dotenv/config"

import connection from "../database/conneciton.js"
import { checkPassword } from "../services/auth.js"

class SessionController {
    async login(req,res) {
        const {email, password} = req.body

        if(!email) {
            return res.status(400).json("All fields must be filled in")
        }

        if(!password) {
            return res.status(400).json("All fields must be filled in")
        }

        connection.query("SELECT * FROM users WHERE email = ?", [email], async(err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else if(result.length === 0) {
                res.status(404).json("Invalid Email / Password")
            } else {
                let user = result[0]
                let checkedPassword = await checkPassword(user, password)

                if(!checkedPassword) {
                    res.status(404).json("Invalid Email / Password")
                } else {
                    const {id} = user
                    res.status(200).json({
                        user: {
                            id,
                            email
                        },
                        token: jwt.sign({id}, process.env.APP_SECRET, {
                            expiresIn: "7d"
                        })
                    })
                }
            }
        })
    }
}

export default new SessionController()