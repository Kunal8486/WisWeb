const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: String,
    postName: String,
    content: String,
    media: [String],
    comments: [{ username: String, text: String }],
    likes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
