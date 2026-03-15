const taskModel = require('../models/task.model')
const projectModel = require('../models/project.model')
const mongoose = require('mongoose')

const createTask = async(projectId, tenantId, title, description, createdBy, assignedTo, dueDate)=>{
        if (!mongoose.Types.ObjectId.isValid(projectId)){
            throw new Error("Invalid project id")
        }

        const project = await projectModel.exists({ 
            _id: projectId,
            tenantId
        })
        
        if (!project){
            throw new Error("Project Not Found")
        }

        if(!title){
            throw new Error("Task title is required")
        }

        const task = await taskModel.create({
            projectId,
            tenantId,
            title,
            description,
            createdBy,
            assignedTo,
            dueDate

        })

        return task
}

const getTasksByProject = async(projectId, tenantId) =>{
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project id")
          }  
        
    
    const project = await projectModel.exists({
        _id: projectId,
        tenantId
    })

    if(!project){
        throw new Error("Project not found")
    }
    
    const tasks = await taskModel.find({
        projectId,
        tenantId
    }).populate("assignedTo", "name email")
    .sort({createdAt: -1})
         
    return tasks

}

const getTaskById = async(taskId, tenantId)=>{
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error("Invalid task id")
    }

    const task = await taskModel.findOne({
        _id: taskId,
        tenantId,    
    }).populate("createdBy", "name email").populate("assignedTo", "name email")

    if(!task){
       throw new Error("Task not found")
    }

     return task
}

const deleteTask = async(taskId, tenantId, role)=>{

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
       throw new Error("Invalid task id")
    }

    if(role !== 'admin' && role !== "owner"){
        throw new Error("Not authorized to delete")
    }

    const task = await taskModel.findOneAndDelete({ 
        _id: taskId,
        tenantId
     })
    
    if(!task){
       throw new Error("Task not found")
    }

    return task

}

const updateTask = async(taskId, tenantId, role, title, description, assignedTo, status, dueDate) =>{
    if(!mongoose.Types.ObjectId.isValid(taskId)){
        throw new Error("Invalid task id")
    }

    if(role !== 'admin' && role !== "owner"){
       throw new Error("Not authorized to update")
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
       throw new Error("Task not found")
    }

    return task 
}

module.exports = {createTask, getTasksByProject, getTaskById, deleteTask, updateTask}