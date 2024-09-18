const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Categories');
const categories = [
    { title: "Technology" },
    { title: "Health" },
    { title: "Science" },
    { title: "Business" },
    { title: "Travel" },
    { title: "Lifestyle" },
    { title: "Education" },
    { title: "Entertainment" },
  ];
  
const testInsert = async () => {
  try {
    console.log('Connected to MongoDB');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 45000
    });
    console.log('Deleted');

    await Category.deleteMany({});

    // Test inserting a document
    await Category.insertMany(categories);
    console.log('category inserted');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during test insert:', error);
    mongoose.connection.close();
  }
};

testInsert();
