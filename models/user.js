const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be empty"],
        validate: {
            validator: function (value) {
                return this.model('User').findOne({username: value})
                    .then(user => {
                        if(user) {
                            return false;
                        }else {
                            return true;
                        }
                    })
            },
            message: props => `Username already exist, please choose another one`   
        }
    },
    password: {
        type: String,
        required: [true, "Password cannot be empty"]
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg"
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {versionKey: false, timestamps: {createdAt: 'createdAt'}});

userSchema.pre('save', function (next) {
    let pass = this.password;
    this.password = require('../helpers/bcr').hashPassword(pass);
    next();
});

module.exports = mongoose.model('User', userSchema);

// default: "https://p7.hiclipart.com/preview/247/564/869/computer-icons-user-profile-clip-art-user-avatar.jpg"
