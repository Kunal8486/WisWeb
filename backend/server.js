const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wisweb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/user', userRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
