const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use remote MongoDB Atlas URI when provided, otherwise fallback to local DB.
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-job-portal';

    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not set. Using local MongoDB instance.');
    }

    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
