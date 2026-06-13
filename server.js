const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
dotenv.config()

process.env.NODE_ENV = process.env.NODE_ENV || "development"

const dbConnect = require("./config/db")
const indexRouter = require("./routes/main.route")
const authRouter = require("./routes/auth.route")
const workspaceRouter = require("./routes/workspace.route")
const projectRouter = require("./routes/project.route")
const taskRouter = require("./routes/task.route")
const workspaceMemberRouter = require("./routes/workspaceMember.route")
const {
  errorHandler,
  onUncaughtException,
  onUnhandledRejection,
} = require("./middleware/errorHandler")

process.on("uncaughtException", onUncaughtException)
process.on("unhandledRejection", onUnhandledRejection)

const app = express()
dbConnect()

app.use(helmet({ contentSecurityPolicy: false }))

app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self' http://localhost:3000; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "frame-ancestors 'none'"
  )
  next()
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, status: "ok", uptime: process.uptime() })
})

app.get("/ready", async (req, res) => {
  const mongoose = require("mongoose")
  const dbState = mongoose.connection.readyState
  if (dbState === 1) {
    res.status(200).json({ success: true, status: "ready", db: "connected" })
  } else {
    res
      .status(503)
      .json({
        success: false,
        status: "not ready",
        db:
          ["disconnected", "connecting", "disconnecting"][dbState] || "unknown",
      })
  }
})

app.use("/api/auth", authLimiter, authRouter)
app.use("/api/workspace", apiLimiter, workspaceRouter)
app.use("/api/projects", apiLimiter, projectRouter)
app.use("/api/tasks", apiLimiter, taskRouter)
app.use("/api/workspace-members", apiLimiter, workspaceMemberRouter)
app.use("/", indexRouter)

app.use(errorHandler)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`)
})
