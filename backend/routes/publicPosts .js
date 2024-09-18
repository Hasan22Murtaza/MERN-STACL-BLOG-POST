const express = require("express");
const Post = require("../models/Post");

const router = express.Router();
router.get("/posts/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    // Find posts that match the provided category ID
    const posts = await Post.find({ category_id: categoryId });
    
    if (posts.length === 0) {
      return res.json([]);
    }
    
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
