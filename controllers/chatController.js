const Chat = require('../models/chats');

class ChatController {

    static readAll(req,res,next) {
        Chat.find({})
            .then(chats => res.status(200).json(chats))
    };

    static readMe(req,res,next) {
        let { to } = req.params.to;
        let from = req.decoded.id;
        Chat.find({to, from})
            .then(chats => res.status(200).json(chats))
            .catch(next); 
    };

    static readMyMessage(req,res,next) {
        let user = req.decoded.id;
        Chat.find({$or: [{to: user}, {from: user}]})
            .populate('to')
            .populate('from')
            .then(chats => res.status(200).json(chats))
            .catch(next);
    }
    
    static create(req,res,next) {
        let Io = req.Io;
        let from = req.decoded.id;
        let { to, message } = req.body;
        Chat.create({from, to, message})
            .then(chat => {
                Io.emit(`${to}-new-message`, chat);
                Io.emit(`${from}-new-message`, chat);
                res.status(202).json(chat);
            })
            .catch(next);
    }; 
    
    static updateRead(req,res,next) {
        let Io = req.Io;
        let _id = req.decoded.id;
        let userId = req.params.userId;
        Chat.updateMany({from: userId, to: _id}, {isRead: true}, {omitUndefined: true})
            .then(() => {
                Chat.find({})
            })
            
    };

};

module.exports = ChatController;