require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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


// Import routes
const postRoutes = require('./Routes/Feed');
const communityRoutes = require('./Routes/Community');
const userRoutes = require('./Routes/Users');

// Use routes
app.use('/posts', postRoutes);
app.use('/communities', communityRoutes);
app.use('/users', userRoutes);

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
