const mongoose = require('mongoose');

module.exports = async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is missing. Add your MongoDB connection string to server/.env.');
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || 'mern_ecommerce',
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
};