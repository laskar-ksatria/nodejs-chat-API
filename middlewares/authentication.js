const { verifyToken } = require('../helpers/jwt');

function authentication(req,res,next) {
    let token = req.headers.alcyonechattoken;
    if (token) {
        let decoded = verifyToken(token);
        req.decoded = decoded;
        next();
    }else {
        next({message: "You must login first as user"})
    }
};

module.exports = authentication;