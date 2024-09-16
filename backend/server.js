const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
require('dotenv').config();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.listen(8000, () => console.log('Server running on port 8000'));
