// db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb+srv://21101001059:Atif903%40@atif.bsbtfxk.mongodb.net/portfolio?retryWrites=true&w=majority&appName=atif";

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables.");
}

/* 
   Use global cache (important for Vercel)
   so new serverless instances reuse the same connection
*/
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // ✅ Reuse existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000, // optional
    };

    console.log("🔌 Connecting to MongoDB Atlas...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
