import connection from "../database/conneciton.js"

class MessagesController {
    async create(req,res) {
        const { sender, text, conversationId } = req.body

        connection.query("INSERT INTO messages(sender, text, conversation_id) VALUES(?,?,?)", [sender, text, conversationId], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else {
                res.status(200).json("Message sent sucessfuly")
            }
        })
    }

    async getMessagesByConversationId (req,res) {

        const { userId } = req.params
        const { id } = req.userId
        const {conversationId} = req.params
        
        if(+userId !== id) {
            return res.status(401).json("Acess Denied")
        }

        connection.query("SELECT * FROM messages WHERE conversation_id = ?", [conversationId], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else {
                res.status(200).json(result)
            }
        })
    }

}

export default new MessagesController()