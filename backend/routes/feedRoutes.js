const express = require('express');
const Post = require('../models/Post'); // Assuming you have a Post model
const router = express.Router();

// Route to get all posts
router.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch posts from MongoDB
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;
