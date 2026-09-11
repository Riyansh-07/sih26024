const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.includes('<username>') || mongoURI.includes('<password>')) {
    console.warn('⚠️  [MongoDB] MONGO_URI is not set or still contains placeholder credentials in .env');
    console.warn('ℹ️  Update your MongoDB Atlas connection string in server/.env to enable database functionality.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
  }
};

module.exports = connectDB;
