const projectModel = require("../models/project.model")
const mongoose = require('mongoose')
const createError = require("../utils/createError")

const createProject = async (name, description, tenantId, createdBy)=>{
    if(!name){
       throw createError("Name is required", 400);
    }
         
    const project = await projectModel.create({
        name,
        description,
        tenantId,
        createdBy
    })
       return project
    }

const getAllProjects = async(tenantId) =>{
    const projects  =await projectModel.find({
        tenantId
        }).sort({createdAt: -1})
    
       return projects
    } 


const getProjectById = async(projectId, tenantId)=>{
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project Id", 400);
        }

        const project = await projectModel.findOne({
            _id: projectId,
            tenantId,
            
        })

        if(!project){
          throw createError("Project not found", 404);
        }

   return project
}

const deleteProject = async(projectId, role, tenantId)=>{
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
         throw createError("Invalid project Id", 400);
    }

     if(role !== 'admin' && role !== "owner"){
      throw createError("Not authorized to delete project", 403);
    }

    const project = await projectModel.findOneAndDelete({
        _id: projectId,
        tenantId
    })

     if(!project){
        throw createError("Project not found", 404);
        }

    return project
  }


const updateProject = async(projectId, tenantId, role, name, description, status) =>{
        if(!mongoose.Types.ObjectId.isValid(projectId)){
           const error = new Error("Invalid project id");
           error.statusCode = 400;
           throw error;
        }

        if(role !== 'admin' && role !== "owner"){
            const error = new Error("Not authorized to update");
            error.statusCode = 403;
            throw error;
        }
        
        const updateData= {}

        if(name) updateData.name = name.trim()
        if(description) updateData.description = description.trim()
        if(status) updateData.status = status.trim()

        const project = await projectModel.findOneAndUpdate({
            _id: projectId,
            tenantId
        },updateData,{new: true})

        
        if(!project){
           throw new Error("Project not found")
        }

       return project

}

module.exports = {createProject, getAllProjects, getProjectById, deleteProject, updateProject}