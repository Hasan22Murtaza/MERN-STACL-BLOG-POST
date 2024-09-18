const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');
const publicPostsRoutes = require('./routes/publicPosts ');
const commentRoutes = require('./routes/comments');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
require('dotenv').config();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/public/', publicPostsRoutes);


app.listen(8000, () => console.log('Server running on port 8000'));
