const express = require('express')
const {registerValidator} = require('../middleware/validate')
const regModel = require('../models/register')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.post('/register', registerValidator, async (req, res)=>{
    const {Workspace, Username, Email, password} = req.body;
    const exists = await regModel.exists({ Email })
    if(exists){
          alert("Account Already Exists!!")
    }
    
    const hashpass = await bcrypt.hash(password, 10)
    const user = await regModel.create({
        Workspace,
        Username, 
        Email,
        password: hashpass
    })
})