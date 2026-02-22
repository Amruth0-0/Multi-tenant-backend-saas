const express = require('express')
const { verifyToken } = require('../middleware/verifyToken')
const createWorkspace = require('../controllers/workspace.controller')
const { workspaceValidator }  = require('../validators/workspace.validator')
const router = express.Router()

router.post('/',verifyToken, workspaceValidator, createWorkspace)

module.exports = router