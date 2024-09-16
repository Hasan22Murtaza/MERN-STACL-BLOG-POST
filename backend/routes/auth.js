const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      // Throw a custom error if the email is already in use
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered" });
  } catch (err) {
    if (err.message === 'Email already exists') {
      // Respond with a 400 status and the specific error message
      return res.status(400).json({ message: err.message });
    }
    
    // Handle other errors
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {      // Throw a custom error if the email is already in use
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({  message : "Logged In", token });
  } catch (err) {
    if (err.message === 'Invalid credentials') {
      // Respond with a 400 status and the specific error message
      return res.status(400).json({ message: err.message });
    }
    
    // Handle other errors
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

module.exports = router;
