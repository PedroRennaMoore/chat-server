import connection from "../database/conneciton.js"


class ConversationsController {
    async create(req, res) {
        const { member1, member2 } = req.body
        
        connection.query("SELECT * FROM conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?,?), '$') OR JSON_CONTAINS(members, JSON_ARRAY(?,?), '$')", [member1, member2, member2, member1], (err, result) => {
            if(err) {
                res.status(500).json(err)
            } else if(result.length !== 0) {
                res.status(200).json(result[0])
            } else {
                connection.query("INSERT INTO conversations(members) VALUES(JSON_ARRAY(?,?))", [member1, member2], (err, result) => {
                    if(err) {
                        res.status(500).json("INTERNAL SERVER ERROR")
                    } else {
                        connection.query("SELECT * FROM conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?,?), '$') OR JSON_CONTAINS(members, JSON_ARRAY(?,?), '$')", [member1, member2, member2, member1], (err, result) => {
                            if(err) {
                                res.status(500).json(err)
                            } else {
                                res.status(200).json(result[0])
                            }
                        })
                    }
                })
            }
        })
    }

    async getConversationsByUserId (req, res) {
        const { id } = req.params
        
        connection.query("SELECT * FROM conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?,?), '$')", [id,id], (err, result) => {
            if(err) {
                res.status(500).json("INTERNAL SERVER ERROR")
            } else if (result.length === 0) {
                res.status(400).json("Theres no conversation for this user")
            } else {
                res.status(200).json(result)
            }
        })
    }

    async getConversationIdByMembers (req,res) {
        const { member1, member2 } = req.params

        connection.query("SELECT * FROM conversations WHERE JSON_CONTAINS(members, JSON_ARRAY(?,?), '$') OR JSON_CONTAINS(members, JSON_ARRAY(?,?), '$')", [+member1, +member2, +member2, +member1], (err, result) => {
            if(err) {
                res.status(500).json("INTERNAL SERVER ERROR")
            } else {
                res.status(200).json(result)
            }
        })
    }

    
}

export default new ConversationsController()