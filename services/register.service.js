const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const createError = require("../utils/createError")

const authService = async ({username, email, password})=>{
    //Check email
    const isEmail = await User.exists({email})
    if (isEmail){
         throw createError("Email already exists", 409);
        }

    //Hash password
    const hashpass = await bcrypt.hash(password, 10)

    //Create user as owner
    const user = await User.create({
         username,
         email,
         password: hashpass
    })
     

   //Create jwt token
   const token = jwt.sign({
    userId: user._id,
    role: user.role
   },process.env.JWT_SECRET,
   {expiresIn: '1d'}
)
  return {token}
}

module.exports = authService
