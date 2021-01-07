const bcr = require('bcryptjs');

function hashPassword(password) {
    let salt = bcr.genSaltSync(10);
    return bcr.hashSync(password, salt)
};

function checkPass(pass, hashPass) {
    return bcr.compareSync(pass, hashPass);
};

module.exports = { hashPassword, checkPass }