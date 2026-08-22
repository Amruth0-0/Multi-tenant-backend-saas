const mongoose = require('mongoose')

function connectDB() {
   const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI
   if (!dbUri) {
      console.error("[DB] Connection failed: Neither MONGO_URI nor MONGODB_URI environment variable is set!")
      process.exit(1)
   }
   mongoose.connect(dbUri).then(() => {
      console.log("[DB] Connected to MongoDB")
   }).catch((err) => {
      console.error("[DB] Connection failed:", err.message)
      process.exit(1)
   })
}

module.exports = connectDB