const express = require('express')
const {verifyToken} = require("../middleware/verifyToken")
const {createProject, getAllProjects, getProjectById, deleteProject} = require("../controllers/project.controller")
const router = express.Router()

router.post("/", verifyToken, createProject)

router.get("/", verifyToken, getAllProjects)
router.get("/:projectId", verifyToken, getProjectById)
router.delete("/:projectId", verifyToken, deleteProject)

module.exports = router



