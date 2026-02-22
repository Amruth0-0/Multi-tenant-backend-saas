const express = require('express')
const {registerValidator, loginValidator} = require('../validators/auth.validator')
const {authRegister, login} = require('../controllers/auth.Controller')
const router = express.Router()


router.post('/login', loginValidator, login);

router.post('/register', registerValidator, authRegister);

module.exports = router