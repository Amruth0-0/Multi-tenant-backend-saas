const express = require("express")
const { verifyToken } = require("../middleware/verifyToken")
const { authRole } = require("../middleware/authRole")
const { createTask, getTasksByProject, getTaskById, updateTask, 
     deleteTask} = require("../controllers/task.controller")
const { taskCreateValidator, taskUpdateValidator} = require("../validators/task.validator")

const router = express.Router()

router.use(verifyToken)

//Create Task
router.post("/:projectId", taskCreateValidator, createTask)

//Get Tasks By Project
router.get("/project/:projectId", authRole("owner","admin"), taskUpdateValidator, getTasksByProject)

//Get Single Task
router.get("/:taskId", getTaskById)

//Update Task
router.put("/:taskId", authRole("owner","admin"), updateTask)

//Delete Task
router.delete("/:taskId", authRole("owner","admin"), deleteTask)

module.exports = router