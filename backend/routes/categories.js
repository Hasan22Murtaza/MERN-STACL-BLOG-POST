const express = require("express");
const Categories = require("../models/Categories");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
