const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/userController');
const ChatController = require('../controllers/chatController');
const authentication = require('../middlewares/authentication');
const { imageUpload } = require('../middlewares/upload');

Router.get('/users', UserController.readAll);
Router.post('/users', UserController.create);
Router.post('/users/login', UserController.login);
Router.get('/user', authentication,UserController.readMe);
Router.post('/user/add', authentication, UserController.addFriends);
Router.post('/user/image', authentication,imageUpload.single('avatar'), UserController.imageUpdate);

Router.get('/chats', ChatController.readAll);
Router.get('/mychats', authentication, ChatController.readMyMessage);
Router.post('/chat', authentication, ChatController.create);

//sandbox
const User = require('../models/user');
const Chat = require('../models/chats');
Router.get('/delete', (req, res, next) => {
    User.deleteMany({}).then(() => {
        Chat.deleteMany({})
            .then(() => {
                res.status(200).json({message: "User has been deleted"})
            })
    })
    
})

module.exports = Router;