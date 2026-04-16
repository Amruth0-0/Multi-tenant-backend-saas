const express = require("express")
const { verifyToken } = require("../middleware/verifyToken")
const { authRole } = require("../middleware/authRole")
const { createTask, getTasksByProject, getTaskById, updateTask,
     deleteTask, getAllTasks } = require("../controllers/task.controller")
const { taskCreateValidator, taskUpdateValidator } = require("../validators/task.validator")

const router = express.Router()

router.use(verifyToken)

//Get All Tasks
router.get("/", getAllTasks)

//Create Task
router.post("/:projectId", taskCreateValidator, createTask)

//Get Tasks By Project
router.get("/project/:projectId", authRole("owner", "admin"), getTasksByProject)

//Get Single Task
router.get("/:taskId", getTaskById)

//Update Task
router.put("/:taskId", authRole("owner", "admin"), updateTask)

//Delete Task
router.delete("/:taskId", authRole("owner", "admin"), deleteTask)

module.exports = router