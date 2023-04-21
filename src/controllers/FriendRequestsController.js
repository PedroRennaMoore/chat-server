import connection from "../database/conneciton.js"

class FriendRequests {
    async create(req, res) {
        const {receiverId, senderId} = req.body

        if(!receiverId) {
            return res.status(400).json("receiver required")
        }

        if(!senderId) {
            return res.status(400).json("sender required")
        }

        connection.query("SELECT * FROM friendrequest WHERE receiverId = ? AND senderId = ? OR receiverId = ? AND senderId = ?", [receiverId, senderId, senderId, receiverId], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else if(result.length !== 0) {
                res.status(400).json("friend request already sent or received")
            } else {
                connection.query("INSERT INTO friendrequest(receiverId, senderId) VALUES(?,?)", [receiverId, senderId], (err,result) => {
                    if(err){
                        res.status(500).json("Internal Server Error")
                    } else {
                        res.status(200).json("friend request sent")
                    }
                })
            }
        })
    }

    async checkFriendRequest (req, res) {
        const {receiverId, senderId} = req.body

        if(!receiverId) {
            return res.status(400).json("receiver required")
        }

        if(!senderId) {
            return res.status(400).json("sender required")
        }

        connection.query("SELECT * FROM friendrequest WHERE receiverId = ? AND senderId = ? OR receiverId = ? AND senderId = ?", [receiverId, senderId, senderId, receiverId], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else if(result.length !== 0) {
                res.status(200).json({isRequested: true})
            } else {
                res.status(200).json({isRequested: false})
            }
        })
    }

    async getFriendsRequest (req,res) {
        const {id} = req.params

        connection.query("SELECT * FROM friendrequest where receiverId = ?", [id], (err, result)=>{
            if(err) {
                res.status(500).json("Internal Server Error")
            } else {
                res.status(200).json(result)
            }
        })
        
    }

    async deleteFriendRequest(req,res) {
        const {id} = req.params

        connection.query("DELETE FROM friendrequest WHERE id = ?", [id], (err, result) => {
            if(err) {
                res.status(500).json("Internal Server Error")
            } else {
                res.status(200).json("friend request deleted")
            }
        })
    }
}

export default new FriendRequests()