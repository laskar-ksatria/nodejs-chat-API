const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "From user cannot empty"]
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {versionKey: false, timestamps: {createdAt: 'createdAt'}});

const chat = mongoose.model('Chat', chatSchema);

module.exports = chat;