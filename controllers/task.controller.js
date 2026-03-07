const taskModel = require('../models/task.model')
const projectModel = require('../models/project.model')
const mongoose = require('mongoose')

const createTask = async(req, res)=>{
    try{
       const { projectId } = req.params
        if (!mongoose.Types.ObjectId.isValid(projectId)){
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
         })
        }

        const project = await projectModel.exists({ 
            _id: projectId,
            tenantId: req.user.tenantId
        })
        
        if (!project){
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
         })
        }

        const title = req.body.title?.trim()
        const description = req.body.description?.trim()
        const assignedTo = req.body.assignedTo
        const dueDate  = req.body.dueDate
        
        if(!title){
            return res.status(400).json({
                success:false,
                message:"Task title is required"
            })
        }

        const task = await taskModel.create({
             title,
             description,
             projectId,
             tenantId: req.user.tenantId,
             createdBy: req.user.userId,
             assignedTo,
             dueDate

        })

        res.status(201).json({
           success: true,
           task,
           message: "Task Created Successfully"
        })
    
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Task Creation Failed"
        })
    }
}

const getTasksByProject = async(req, res) =>{
   try{
       const { projectId } = req.params
          if(!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid project ID"
            })
          }  
        
        const project = await projectModel.exists({
            _id: projectId,
            tenantId: req.user.tenantId
        })

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            })
        }

       const tasks = await taskModel.find({
            projectId,
            tenantId: req.user.tenantId
       }).sort({createdAt: -1})
         
       res.status(200).json({
           success: true,
           count: tasks.length,
           tasks
       })

   }catch(err){
       return res.status(500).json({
         success: false,
         message: "Failed to fetch task"
       })
   }
}

const getTaskById = async(req, res)=>{
    try{
        const { taskId } = req.params
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid task ID"
            })
        }

        const task = await taskModel.findOne({
            _id: taskId,
            tenantId: req.user.tenantId,
            
        })

        if(!task){
            return res.status(404).json({
                success: false,
                message: "task not found"
            })
        }

        return res.status(200).json({
            success: true,
            task
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch task"
        })
    }
}

const deleteTask = async(req, res)=>{
  try{
     const {taskId} = req.params

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
               success: false,
               message: "Invalid task ID"
            })
        }

    const task = await taskModel.findOne({
        _id: taskId,
        tenantId: req.user.tenantId
    })

    if(!task){
        return res.status(404).json({
            success: false,
            message: "task not found"
        })
    }

    if(req.user.role !== 'admin' && req.user.role !== "owner"){
        return res.status(403).json({
            success: false,
            message: "Not Authorized to delete"
        })
    }

    await taskModel.deleteOne({ 
        _id: taskId,
        tenantId: req.user.tenantId
     })

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    })

  }catch(err){
    return res.status(500).json({
        success: false,
        message: "Failed to delete Task"
    })
  }
}

const updateTask = async(req, res) =>{
    try{
        const { taskId } = req.params
        if(!mongoose.Types.ObjectId.isValid(taskId)){
            return res.status(400).json({
                success: false,
                message: "Invalid task Id"
            })
        }

        const task = await taskModel.findOne({
             _id: taskId,
             tenantId: req.user.tenantId
        })

        if(!task){
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        if(req.user.role !== 'admin' && req.user.role !== "owner"){
        return res.status(403).json({
            success: false,
            message: "Not Authorized to Update"
        })
       }
       
        const title = req.body.title?.trim()
        const description = req.body.description?.trim()
        const assignedTo = req.body.assignedTo
        const status = req.body.status
        const dueDate  = req.body.dueDate

        const update = await taskModel.findOneAndUpdate({
            _id: taskId,
            tenantId: req.user.tenantId
        },{
             title,
             description,
             status,
             assignedTo,
             dueDate
        },{new: true})

        res.status(200).json({
            success: true,
            task: update,
            message: "Task Updated successfully"
        })
     }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to update task"
        })
    }
}

module.exports = {createTask, getTasksByProject, getTaskById, deleteTask, updateTask}