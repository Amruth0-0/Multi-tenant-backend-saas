const user = require("../models/user.model")
const workspace = require("../models/workspace.model")
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
     
     const work = await workspace.findOne({
        _id : found.workspaceId
     })
     if(!work){
         throw new Error("Workspace not found")
     }
     if(work.status !== 'Active'){
          throw new Error("Workspace suspended")
     }

    const token = jwt.sign({
         userId : found.id,
         workspaceId : found.workspaceId,
         role: found.role,
     },
     process.env.JWT_SECRET,
     {expiresIn: '1d'}
    )
     return  { token }
}

module.exports =  authSignin 