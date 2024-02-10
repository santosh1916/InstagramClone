const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: String,
    description: String,
    filename: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Post', postSchema);
