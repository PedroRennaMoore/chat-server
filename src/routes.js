import express from 'express'

import { upload } from './multer/config.js'

import HelloController from './controllers/HelloController.js'
import UserController from './controllers/UserController.js'
import SessionController from './controllers/SessionController.js'
import ConversationsController from './controllers/ConversationsController.js'
import MessagesController from './controllers/MessagesController.js'

import { TokenAuth } from './middlewares/auth.js'
import FriendRequestsController from './controllers/FriendRequestsController.js'


const router = express.Router()

router.get("/hello", HelloController.hello)

// -------- PUBLIC ----------- // 

//users

router.post("/users", upload.single('image'), UserController.create)


//session
router.post("/login", SessionController.login)


// -------- PRIVATE ----------- // 7

router.use(TokenAuth)

//users

router.get("/users/search", UserController.searchUsersByEmail)
router.get("/users/:id", UserController.getUserProfile)
router.put("/users/friends", UserController.updateFriends)
router.get("/users/:id/friends", UserController.getFriends)

//conversations

router.post("/conversations", ConversationsController.create)
router.get("/conversations/:id", ConversationsController.getConversationsByUserId)
router.get("/conversations/:member1/:member2", ConversationsController.getConversationIdByMembers)

//messages 

router.post("/messages", MessagesController.create)
router.get("/messages/:userId/:conversationId", MessagesController.getMessagesByConversationId)

//friendRequest

router.post("/friendrequest", FriendRequestsController.create)
router.post("/friendrequest/isfriend", FriendRequestsController.checkFriendRequest)
router.get("/friendrequest/:id", FriendRequestsController.getFriendsRequest)
router.delete("/friendrequest/:id/delete", FriendRequestsController.deleteFriendRequest)

export default router