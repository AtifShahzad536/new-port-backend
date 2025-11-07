import { createServer } from 'http'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 4000

async function start () {
  try {
    await connectDB()
    const server = createServer(app)
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
