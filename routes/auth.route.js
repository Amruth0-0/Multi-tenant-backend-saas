const express = require('express')
const {registerValidator} = require('../middleware/validate')
const {authRegister, login} = require('../controllers/auth.Controller')
const router = express.Router()


router.post('/login', login);

router.post('/register', registerValidator, authRegister);

module.exports = router