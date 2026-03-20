const express = require('express')
const { verifyToken } = require("../middleware/verifyToken")
const { authRole } = require('../middleware/authRole')
const { projectCreateValidator, projectUpdateValidator } = require("../validators/project.validator");

const {createProject, getAllProjects, getProjectById, deleteProject, updateProject} = require("../controllers/project.controller")
const router = express.Router()

router.use(verifyToken)

//Create Project
router.post("/", projectCreateValidator,  createProject)

//Get All Projects
router.get("/", getAllProjects)

//Get Single Project
router.get("/:projectId", getProjectById)

//Update Project
router.put("/:projectId", authRole("admin"), projectUpdateValidator, updateProject)

//Delete Project
router.delete("/:projectId",authRole("admin"), deleteProject)

module.exports = router



