const user = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const authSignin = async({email, password})=>{
     const found = await user.findOne({email}).select("+password")
     if(!found){
        throw new Error("Invalid Credentials") 
        }
     
     const match = await bcrypt.compare(password, found.password)
     if(!match){
       throw new Error("Invalid Credentials") 
     }

    const token = jwt.sign({
         userId : found._id

     },
     process.env.JWT_SECRET,
     {expiresIn: '1d'}
    )
     return  { token }
}

module.exports =  authSignin 