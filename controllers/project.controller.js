const projectModel = require("../models/project.model")
const mongoose = require('mongoose')

const createProject = async (req, res)=>{
    try{
        const name = req.body.name?.trim()
        const description = req.body.description?.trim()
        if(!name){
            return res.status(400).json({
                success: false,
                message: "Name is required"
            })
        }
         
        const project = await projectModel.create({
            name,
            description,
            tenantId: req.user.tenantId,
            createdBy: req.user.userId
        })

        res.status(201).json({
            success: true,
            project,
            message: "Project created "
        })

    }catch(err){
      return res.status(500).json({
        success: false,
        message: "Project Creation Failed" 
      })
    }
}

const getAllProjects = async(req, res) =>{
    try{
        const projects  =await projectModel.find({
            tenantId: req.user.tenantId
            }).sort({createdAt: -1})
    
        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        })
    } 
}

const getProjectById = async(req, res)=>{
    try{
        const { projectId } = req.params
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid project ID"
            })
        }

        const project = await projectModel.findOne({
            _id: projectId,
            tenantId: req.user.tenantId,
            
        })

        if(!project){
            return res.status(404).json({
                success: false,
                message: "project not found"
            })
        }

        return res.status(200).json({
            success: true,
            project
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        })
    }
}

const deleteProject = async(req, res)=>{
  try{
     const {projectId} = req.params

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid project ID"
            })
        }

    const project = await projectModel.findOne({
        _id: projectId,
        tenantId: req.user.tenantId
    })

    if(!project){
        return res.status(404).json({
            success: false,
            message: "Project not found"
        })
    }

    if(req.user.role !== 'admin' && req.user.role !== "owner"){
        return res.status(403).json({
            success: false,
            message: "Not Authorized to delete"
        })
    }

    await projectModel.deleteOne({ _id: projectId })

    res.status(200).json({
        success: true,
        message: "Project deleted successfully"
    })

  }catch(err){
    return res.status(500).json({
        success: false,
        message: "Failed to delete project"
    })
  }
}

module.exports = {createProject, getAllProjects, getProjectById, deleteProject}