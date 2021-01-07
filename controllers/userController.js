const User = require('../models/user');
const { checkPass } = require('../helpers/bcr');
const { generateToken } = require('../helpers/jwt');

class UserController {

    static readAll(req,res,next) {
        User.find({})
            .populate('friends')
            .then(users => res.status(200).json(users))
            .catch(next)
    };

    static readMe(req,res,next) {
        let _id = req.decoded.id;
        User.findOne({_id})
            .populate('friends')
            .then(user => res.status(200).json(user))
            .catch(next);
    };

    static create(req,res,next) {
        let Io = req.Io;
        let { username, password } = req.body;
        User.create({username, password})
            .then(user => {
                Io.emit(`new-user`, user);
                res.status(202).json({message: "Thank you for registering"})
            })
            .catch(next)
    };

    static login(req,res,next) {
        let { username, password } = req.body;
        let Io = req.Io;
        User.findOne({username})
            .then(user => {
                if (user) {
                    let hashPass = user.password;
                    if (checkPass(password, hashPass)) {
                        let token = generateToken({id: user.id});
                        res.status(202).json({message: `Welcome ${username}`, token, user});
                    }else {
                        next({message: "Invalid username / password"})
                    }
                }else {
                    next({message: "Invalid username / password"})
                }
            })

    };

    static addFriends(req,res,next) {
        let Io = req.Io;
        let _id = req.decoded.id;
        let { username } = req.body;
        User.findOne({username})
            .then(user => {
                if(user) {
                    let find = false;
                    let { friends } = user;
                    
                    friends.forEach(item => {
                        if(item == _id) {
                            find = true;
                        }
                    })


                    if (!find) {
                        User.findOneAndUpdate({_id}, {$push: {friends: user.id}}, {omitUndefined: true, new: true})
                        .populate('friends')
                        .then(updateUser => {
                            Io.emit(`${user.id}-addnewfriend`, updateUser)
                            User.findOneAndUpdate({username}, {$push: {friends: updateUser.id}}, {omitUndefined: true})
                            .then((newUpdate) => {
                                res.status(200).json(newUpdate)
                                    
                                })
                        })
                    }else {
                        next({message: "You're both already friend"})
                    }
                }else {
                    next({message: "Username does not exist"})
                }
            })
    };

    static imageUpdate(req, res,next) {
        let Io = req.Io;
        if (!req.file || !req.file.path) {
            next({message: "Only jpg, jpeg & png file supported"})
        }else {
            let url = "http://" + req.headers.host + "/" + req.file.path;
            let _id = req.decoded.id;
            User.findOneAndUpdate({_id}, {avatar: url}, {omitUndefined: true, new: true })
                .then(newUpdate => {
                    let { friends } = newUpdate;
                    res.status(201).json(newUpdate.avatar);
                    for (let i = 0; i < friends.length; i++) {
                        Io.emit(`${friends[i]}-image-update`, newUpdate.avatar);
                    };
                })
        }
            
    };

};

module.exports = UserController;