const express = require('express')
const {registerValidator} = require('../middleware/validate')
const {authRegister} = require('../controllers/auth.regController')
const router = express.Router()

router.get('/register', (req,res)=>{
    res.render('register')
})

router.post('/register', registerValidator, authRegister);

module.exports = router