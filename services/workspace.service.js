const Workspace = require("../models/workspace.model")
const WorkspaceMember = require("../models/workspaceMember.model")

const createWorkspace = async({name, userId})=>{
   const wkspace = await Workspace.create({
        name: name,
        ownerID: userId
   })

   const wkMember  = await WorkspaceMember.create({
       user: userId,
       workspace: wkspace._id,
       role: "owner"
   })

   return {
   tenantID: wkspace.tenantID,
   name: wkspace.name
}

}

module.exports = { createWorkspace }