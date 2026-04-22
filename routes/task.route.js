const express = require("express")
const { verifyToken } = require("../middleware/verifyToken")
const { authRole } = require("../middleware/authRole")
const { createTask, getTasksByProject, getTaskById, updateTask,
     deleteTask, getAllTasks, getMyTasks } = require("../controllers/task.controller")
const { taskCreateValidator, taskUpdateValidator } = require("../validators/task.validator")

const router = express.Router()

router.use(verifyToken)

//Get All Tasks
router.get("/", getAllTasks)

// Get My Assigned Tasks
router.get("/me", getMyTasks)

//Create Task
router.post("/:projectId", taskCreateValidator, createTask)

//Get Tasks By Project
router.get("/project/:projectId", getTasksByProject)

//Get Single Task
router.get("/:taskId", getTaskById)

//Update Task
router.put("/:taskId", authRole("owner", "admin"), updateTask)

//Delete Task
router.delete("/:taskId", authRole("owner", "admin"), deleteTask)

module.exports = router