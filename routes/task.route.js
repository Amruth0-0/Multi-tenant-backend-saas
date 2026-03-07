const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const { createTask, getTasksByProject, getTaskById, updateTask,
     deleteTask} = require("../controllers/task.controller")

const router = express.Router()



router.post("/projects/:projectId/tasks", verifyToken, createTask)

router.get("/projects/:projectId/tasks", verifyToken, getTasksByProject)
router.get("/tasks/:taskId", verifyToken, getTaskById)

router.put("/tasks/:taskId", verifyToken, updateTask)

router.delete("/tasks/:taskId", verifyToken, deleteTask)

module.exports = router