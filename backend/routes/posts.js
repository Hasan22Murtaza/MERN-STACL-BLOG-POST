const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { title, content, category_id } = req.body;
  try {
    const post = new Post({ title, content, category_id, user_id: req.user._id });
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user._id }).populate('user_id', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user_id', 'username');
    if (!post) return res.status(404).send('Post not found');
    res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { title, content, category_id } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }
    post.title = title;
    post.content = content;
    post.category_id = category_id;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }
    await post.deleteOne();
    res.send('Post deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
