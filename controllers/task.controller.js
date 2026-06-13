const taskService = require('../services/task.service')

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const title = req.body.title?.trim();
        const description = req.body.description?.trim();
        const createdBy = req.user.userId;
        const tenantId = req.user.tenantId;
        const assignedTo = req.body.assignedTo === "" ? null : req.body.assignedTo;
        const dueDate = req.body.dueDate;
        const status = req.body.status;

        const task = await taskService.createTask(
            title,
            description,
            projectId,
            tenantId,
            createdBy,
            assignedTo,
            dueDate,
            status
        )

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        })

    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to create task"
        })
    }
}

const getTasksByProject = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 50

        const result = await taskService.getTasksByProject(
            req.params.projectId,
            req.user.tenantId,
            page,
            limit
        )

        return res.status(200).json({
            success: true,
            tasks: result.tasks,
            total: result.total,
            page: result.page,
            limit: result.limit,
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to fetch task"
        })
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(
            req.params.taskId,
            req.user.tenantId
        )
        return res.status(200).json({
            success: true,
            task
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to fetch task"
        })
    }
}


const deleteTask = async (req, res) => {
    try {
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

    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to delete Task"
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const title = req.body.title?.trim()
        const description = req.body.description?.trim()
        const assignedTo = req.body.assignedTo === "" ? null : req.body.assignedTo;
        const status = req.body.status
        const dueDate = req.body.dueDate

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

        return res.status(200).json({
            success: true,
            task,
            message: "Task Updated successfully"
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to update task"
        })
    }
}

const getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 50

        const result = await taskService.getAllTasks(req.user.tenantId, page, limit);
        return res.status(200).json({
            success: true,
            tasks: result.tasks,
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Failed to fetch tasks"
        });
    }
}

const getMyTasks = async (req, res) => {
    try {
        const tasks = await taskService.getMyTasks(req.user.userId, req.user.tenantId);
        return res.status(200).json({ success: true, tasks });
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message || "Failed to fetch your tasks" });
    }
}

module.exports = { createTask, getTasksByProject, getTaskById, deleteTask, updateTask, getAllTasks, getMyTasks }
