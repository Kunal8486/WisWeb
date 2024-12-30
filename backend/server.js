require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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

// Post Schema
const postSchema = new mongoose.Schema({
    username: String,
    postName: String,
    content: String,
    media: [String], // Array of file paths
    comments: [{ username: String, text: String }],
    likes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// API Routes

// Create a new post
app.post('/posts', upload.array('media', 10), async (req, res) => {
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
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Like a post
app.put('/posts/:id/like', async (req, res) => {
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


app.put('/posts/:id/downvotes', async (req, res) => {
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
app.post('/posts/:id/comment', async (req, res) => {
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

// Share a post
app.put('/posts/:id/share', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        post.shares += 1;
        await post.save();
        res.status(200).json({ message: 'Post shared', shares: post.shares });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'Failed to share post' });
    }
});



//Community

const communitySchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: false, default: '/uploads/community.png'  },
    userID: { type: String, required: false }, // ID of the user who created the community
    createdAt: { type: Date, default: Date.now }, // Time when the community was created
  });
  
  
  const Community = mongoose.model('Community', communitySchema)
  

  // Routes
  app.get('/communities', async (req, res) => {
    try {
      const communities = await Community.find()
      res.json(communities)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
// Community Route
app.post('/communities', upload.single('icon'), async (req, res) => {
    const { category, name, description } = req.body;
    const iconPath = req.file ? `/uploads/${req.file.filename}` : '/uploads/community.png';
      const community = new Community({ category, name, description, icon: iconPath });
  
    try {
      const newCommunity = await community.save();
      res.status(201).json(newCommunity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
 // Update Community
app.put('/communities/:id', upload.single('icon'), async (req, res) => {
    const { category, name, description } = req.body;
  
    // Check if a new icon was uploaded
    const iconPath = req.file ? `/uploads/${req.file.filename}` : undefined;
  
    // Prepare the update data
    const updateData = { category, name, description };
    if (iconPath) updateData.icon = iconPath; // Update icon only if a new one is uploaded
  
    try {
      // Find the community by ID and update it
      const updatedCommunity = await Community.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      // Check if the community exists
      if (!updatedCommunity) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      // Respond with the updated community
      res.json(updatedCommunity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
  app.delete('/communities/:id', async (req, res) => {
    try {
      await Community.findByIdAndDelete(req.params.id)
      res.json({ message: 'Community deleted' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// Server setup
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
