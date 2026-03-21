const taskModel = require('../models/task.model')
const projectModel = require('../models/project.model')
const mongoose = require('mongoose')
const createError = require("../utils/createError")

const createTask = async( title, description, projectId, tenantId, createdBy, assignedTo, dueDate, status)=>{
        if (!mongoose.Types.ObjectId.isValid(projectId)){
            throw createError("Email already exists", 409);
        }

        const project = await projectModel.exists({ 
            _id: projectId,
            tenantId
        })
        
        if (!project){
            throw createError("Project not found", 404);
        }

        if(!title){
            throw createError("Task title is required", 400);
        }

        const task = await taskModel.create({
          title,
          description,
          projectId,
          tenantId,
          createdBy,
          assignedTo,
          dueDate,
          status
        });

        return task
}

const getTasksByProject = async(projectId, tenantId) =>{
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project id", 400);
     }  
        
    
    const project = await projectModel.exists({
        _id: projectId,
        tenantId
    })

    if(!project){
        throw createError("Project not found", 404);
    }
    
    const tasks = await taskModel.find({
        projectId,
        tenantId
    }).populate("assignedTo", "username email")
    .sort({createdAt: -1})
         
    return tasks

}

const getTaskById = async(taskId, tenantId)=>{
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw createError("Invalid task id", 400);
    }

    const task = await taskModel.findOne({
        _id: taskId,
        tenantId,    
    }).populate("createdBy", "username email").populate("assignedTo", "username email")

    if(!task){
       throw createError("Task not found", 404);
    }

     return task
}

const deleteTask = async(taskId, tenantId, role)=>{

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
       throw createError("Invalid task id", 400)
    }

    if(role !== 'admin' && role !== "owner"){
        throw createError("Not authorized to delete", 403)
    }

    const task = await taskModel.findOneAndDelete({ 
        _id: taskId,
        tenantId
     })
    
    if(!task){
      throw createError("Task not found", 404);
    }

    return task

}

const updateTask = async(taskId, tenantId, role, title, description, assignedTo, status, dueDate) =>{
    if(!mongoose.Types.ObjectId.isValid(taskId)){
         throw createError("Invalid task id", 400);
    }

    if(role !== 'admin' && role !== "owner"){
       throw createError("Not authorized to update", 403)
    }
       
    const updateData = {}
    if(title) updateData.title = title.trim()
    if(description) updateData.description = description.trim()
    if(assignedTo) updateData.assignedTo = assignedTo
    if(status) updateData.status = status
    if(dueDate) updateData.dueDate = dueDate

    const task = await taskModel.findOneAndUpdate({
     _id: taskId,
     tenantId
    }, updateData ,{new: true})
    
    if(!task){
       throw createError("Task not found", 404)
    }

    return task 
}

module.exports = {createTask, getTasksByProject, getTaskById, deleteTask, updateTask}