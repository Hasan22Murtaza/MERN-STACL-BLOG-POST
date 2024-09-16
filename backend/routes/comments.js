const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { postId, content } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send('Post not found');
    const comment = new Comment({ content, post_id: postId, user_id: req.user._id });
    await comment.save();
    res.status(201).send(comment);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.postId }).populate('user_id', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('Comment not found');
    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('Comment not found');
    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }
    await comment.remove();
    res.send('Comment deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
