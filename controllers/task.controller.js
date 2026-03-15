const taskService = require('../services/task.service')

const createTask = async(req, res)=>{
    try{
       const title = req.body.title?.trim()
       const description = req.body.description?.trim()
       const createdBy = req.body.createdBy
       const assignedTo = req.body.assignedTo
       const dueDate = req.body.dueDate

       const task = await taskService.createTask(
          req.params.projectId,
          req.user.tenantId,
          title,
          description,
          createdBy,
          assignedTo,
          dueDate 
       )

       return res.status(201).json({
         success: true,
         message: "Task created successfully",
         task
        })

   }catch(err){
       return res.status(500).json({
         success: false,
         message: err.message || "Failed to create task"
       })
   }
}

const getTasksByProject = async(req, res)=>{
    try{
        const tasks = await taskService.getTasksByProject(
            req.params.projectId,
            req.user.tenantId
        )
        
        return res.status(200).json({
            success: true,
            tasks
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message:  err.message || "Failed to fetch task"
        })
    }
}

const getTaskById = async(req, res)=>{
    try{
         const task = await taskService.getTaskById(
            req.params.taskId,
            req.user.tenantId
        )
        return res.status(200).json({
            success: true,
            task
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message:  err.message || "Failed to fetch task"
        })
    }
}


const deleteTask = async(req, res)=>{
  try{
    const task = await taskService.deleteTask(
        req.params.taskId,
        req.user.tenantId,
        req.user.role
    )

    return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task
        })

  }catch(err){
    return res.status(500).json({
        success: false,
        message: err.message || "Failed to delete Task"
    })
  }
}

const updateTask = async(req, res) =>{
    try{
        const title = req.body.title?.trim()
        const description = req.body.description?.trim()
        const assignedTo = req.body.assignedTo
        const status = req.body.status
        const dueDate  = req.body.dueDate

        const task = await taskService.updateTask(
            req.params.taskId, 
            req.user.tenantId, 
            req.user.role, 
            title, 
            description, 
            assignedTo, 
            status, 
            dueDate
        )

        res.status(200).json({
            success: true,
            task,
            message: "Task Updated successfully"
        })
     }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to update task"
        })
    }
}

module.exports = {createTask, getTasksByProject, getTaskById, deleteTask, updateTask}