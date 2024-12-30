require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../Models/Feed.js');
const router = express();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Create a new post
router.post('/', upload.array('media', 10), async (req, res) => {
    try {
        const { username, postName, content } = req.body;
        const mediaPaths = req.files.map((file) => `/uploads/${file.filename}`);
        const newPost = new Post({ username, postName, content, media: mediaPaths });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Like a post
router.put('/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        post.likes += 1;
        await post.save();
        res.status(200).json({ message: 'Post liked', likes: post.likes });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to like post' });
    }
});


router.put('/:id/downvotes', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        post.downvotes += 1;
        await post.save();
        res.status(200).json({ message: 'Post disliked', downvotes: post.downvotes });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to dislike post' });
    }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
    try {
        const postId = req.params.id;
        const { username, text } = req.body;
        const post = await Post.findById(postId);
        post.comments.push({ username, text });
        await post.save();
        res.status(200).json({ message: 'Comment added', post });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to add comment' });
    }
});



module.exports = router;
