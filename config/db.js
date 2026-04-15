const mongoose = require('mongoose')

function connectDB() {
   mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("[DB] Connected to MongoDB")
   }).catch((err) => {
      console.error("[DB] Connection failed:", err.message)
      process.exit(1)
   })
}

module.exports = connectDB