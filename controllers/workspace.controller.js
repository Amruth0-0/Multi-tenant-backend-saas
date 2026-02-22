const workspaceService = require('../services/workspace.service')

const workspaceCreate = async(req, res)=>{
    try{
        const name = req.body.name
        if(!name){
            return res.status(400).json({
                 success: false,
                 message: "Bad request"
        })
        }  

        const userId = req.user.userId
        const workspace = await workspaceService.createWorkspace({
              name,
            userId
         })
             res.status(201).json({
                 success: true,
                message: "Workspace created",
                workspace
             })
    }catch(error){
         console.log(error);
        return res.status(500).json({
           success: false,
           message: "Workspace creation failed"
        })
    }
}

module.exports = workspaceCreate