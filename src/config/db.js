import mongoose from 'mongoose'

export async function connectDB () {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio'
  const opts = {
    autoIndex: true,
    serverSelectionTimeoutMS: 8000
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
  })
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })

  try {
    console.log('Connecting to MongoDB ...')
    await mongoose.connect(uri, opts)
    return mongoose
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    throw err
  }
}
