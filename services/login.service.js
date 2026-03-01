const user = require("../models/user.model")
const WorkspaceMember = require("../models/workspaceMember.model")
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
     
     const memberships = await WorkspaceMember.find({user: found._id
     })
     .populate("workspace");
     
     const workspaces = await memberships.map(member => ({
         workspaceId: member.workspace._id,
         name: member.workspace.name,
         role: member.role
     }))
     
     return {
          userId: found_id,
          workspaces
     }
}

module.exports =  authSignin 