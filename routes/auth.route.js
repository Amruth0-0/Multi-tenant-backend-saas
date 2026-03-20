const express = require('express')
const {registerValidator, loginValidator} = require('../validators/auth.validator')
const {authRegister, login, logout, selectWorkspace} = require('../controllers/auth.controller')
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router()

//Register
router.post('/register', registerValidator, authRegister);

//Login
router.post('/login', loginValidator, login); 

//Logout
router.post('/logout', verifyToken, logout);

//Select Workspace
router.post(/workspace/select, verifyToken, selectWorkspace);



module.exports = router