const mongoose = require('mongoose')

const connectDB = async (dbName) => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return mongoose.connection
  }

  const url = process.env.MONGO_CONNECTION_STRING
  if (!url) throw new Error('❌ MONGO_CONNECTION_STRING not found in .env')

  try {
    await mongoose.connect(url, {
      dbName,
    })
    console.log('✅ Connected to MongoDB Atlas')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    throw err
  }
}

module.exports = connectDB