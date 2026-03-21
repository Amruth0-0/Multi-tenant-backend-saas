const projectService = require('../services/project.service')

const createProject = async (req, res)=>{
    try{
        const name = req.body.name?.trim()
        const description = req.body.description?.trim()

        const project = await projectService.createProject(
            name, 
            description,
            req.user.tenantId,
            req.user.userId
        )

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        })

    }catch(err){
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Project Creation Failed" 
      })
    }
}

const getAllProjects = async(req, res) =>{
    try{
        const projects  = await projectService.getAllProjects(
            req.user.tenantId
        )
    
        return res.status(200).json({
            success: true,
            count: projects.length,
            projects
        })

    }catch(err){
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to fetch projects"
        })
    } 
}

const getProjectById = async(req, res)=>{
    try{
        const project = await projectService.getProjectById(
            req.params.projectId,
            req.user.tenantId
        )
     
        return res.status(200).json({
            success: true,
            project
        })

    }catch(err){
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to fetch project"
        })
    }
}

const deleteProject = async(req, res)=>{
  try{

    const project = await projectService.deleteProject(
        req.params.projectId,
        req.user.role,
        req.user.tenantId
    )

    return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        project
    })

  }catch(err){
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to delete project"
    })
  }
}

const updateProject = async(req, res) =>{
    try{
       
        const name = req.body.name?.trim()
        const description = req.body.description?.trim()
        const status = req.body.status

        const project = await projectService.updateProject(
            req.params.projectId,
            req.user.tenantId,
            req.user.role,
            name,
            description,
            status
        )

        return res.status(200).json({
            success: true,
            project,
            message: "Project Updated successfully"
        })

     }catch(err){
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to update project"
        })
    }
}

module.exports = {createProject, getAllProjects, getProjectById, deleteProject, updateProject}