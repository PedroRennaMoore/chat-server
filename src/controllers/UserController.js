import connection from "../database/conneciton.js";
import { createPasswordHash } from "../services/auth.js";
import { sendImage, setImageUrl } from "../services/firebase.js";

class UserController {
    async create (req, res) {

        //configuring image to be sent to database
        
        const image = req.file
        const { name, email, password } = req.body

        if(!name) {
            return res.status(500).json("Name Required")
        }

        if(!email) {
            return res.status(500).json("Email Required")
        }

        if(!password) {
            return res.status(500).json("Password Required")
        }
        
        connection.query("SELECT email FROM users WHERE email = ?", [email], async (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error2")
            } else if(result.length !== 0) {
                res.status(400).json("Email Already Registered")
            } else {
                let firebaseUrl = await setImageUrl(image)
                let hashedPassword = await createPasswordHash(password)

                connection.query("INSERT INTO users(name, email, password, profile_img_url, friends) VALUES(?,?,?,?,'[]')", [name, email, hashedPassword, firebaseUrl], (err, result) => {
                
                    if(err) {
                        res.status(500).json(err)
                    } else {
                        if(image) {
                            sendImage(image)
                        }
                        res.status(200).json("User Created Successfully")
                    }
                })
            }
        })
    }

    async searchUsersByEmail(req, res) {
        const {id} = req.userId
        const {email} = req.query

        connection.query("SELECT name, email, profile_img_url, id FROM users WHERE email LIKE ? AND id != ?", [`${email}%`, id] , (err, result) => {
            if(err) {
                res.status(500).json(err)
            } else{
                res.status(200).json(result)
            }
        })
    }

    async getUserProfile(req, res) {
        const {id} = req.params
        connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else if(result.length === 0) {
                res.status(404).json("User not found")
            } else{
                let user = result[0]
                res.status(200).json({
                    name: user.name,
                    email: user.email,
                    friends: user.friends,
                    profile_img_url: user.profile_img_url,
                    user_id: user.id
                })
            }
        })
    }

    async updateFriends(req, res) {
        const { id } = req.userId
        const {friendId} = req.body
        
        connection.query("SELECT friends FROM users WHERE id = ?", [ id], (err, result) => {
            if(err) {
                res.status(500).json(err)
            } else {
                let friends = result[0].friends
                if(friends.includes(friendId)) {
                    res.status(400).json("You already friends")
                } else {
                    connection.query("UPDATE users SET friends = JSON_ARRAY_APPEND(friends,'$', ?) WHERE id = ?", [friendId, id], (err, result) => {
                        if(err) {       
                            res.status(500).json("Internal Server Error")
                        } else {
                            connection.query("UPDATE users SET friends = JSON_ARRAY_APPEND(friends,'$', ?) WHERE id = ?", [id, friendId], (err, result) => {
                                if(err) {       
                                    res.status(500).json("Internal Server Error")
                                } else {
                                    res.status(200).json("You became friends")
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    async getFriends (req, res) {
        const { id } = req.userId

        connection.query("SELECT friends FROM users WHERE id = ?", [ id], (err, result) => {
            if(err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(result[0])
            }
        })
    }
}



export default new UserController()