const user = require("../models/user.model")
const WorkspaceMember = require("../models/workspaceMember.model")
const jwt = require('jsonwebtoken')
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")

const authSignin = async({email, password})=>{
     const found = await user.findOne({email}).select("+password")
     if(!found){
        throw createError("Invalid Credentials", 401);
        }
     
     const match = await bcrypt.compare(password, found.password)
     if(!match){
       throw createError("Invalid Credentials", 401); 
     }
     
     const memberships = await WorkspaceMember.find({userId: found._id
     })
     .populate("workspaceId");
     
    const workspaces = memberships
      .filter((member) => member && member.workspaceId)
      .map((member) => ({
        workspaceId: member.workspaceId._id,
        tenantId: member.workspaceId.tenantId,
        name: member.workspaceId.name,
        role: member.role,
      }));
     
     const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;

     const token = jwt.sign(
       {
         userId: found._id,
         workspaceId: activeWorkspace ? activeWorkspace.workspaceId : null,
         tenantId: activeWorkspace ? activeWorkspace.tenantId : null,
         role: activeWorkspace ? activeWorkspace.role : null,
       },
       process.env.JWT_SECRET,
       { expiresIn: "1d" },
     );


     return {
          token,
          userId: found._id,
          workspaces
     }
}

module.exports =  authSignin 