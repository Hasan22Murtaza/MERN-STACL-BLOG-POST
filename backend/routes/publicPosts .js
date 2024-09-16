const express = require("express");
const Post = require("../models/Post");

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
