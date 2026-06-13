const projectModel = require("../models/project.model")
const taskModel = require("../models/task.model")
const mongoose = require('mongoose')
const createError = require("../utils/createError")

const DEFAULT_PAGE_LIMIT = 50
const MAX_PAGE_LIMIT = 100

const createProject = async (name, description, tenantId, createdBy) => {
    if (!name) {
        throw createError("Name is required", 400);
    }

    try {
        const project = await projectModel.create({
            name,
            description,
            tenantId,
            createdBy
        })
        return project
    } catch (error) {
        if (error.code === 11000) {
            throw createError("A project with this name already exists in your workspace", 400);
        }
        throw error;
    }
}

const getAllProjects = async (tenantId, page = 1, limit = DEFAULT_PAGE_LIMIT) => {
    const pageLimit = Math.min(Math.max(1, limit), MAX_PAGE_LIMIT)
    const skip = (Math.max(1, page) - 1) * pageLimit

    const [projects, total] = await Promise.all([
        projectModel.find({ tenantId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageLimit),
        projectModel.countDocuments({ tenantId })
    ])

    return { projects, total, page: Math.max(1, page), limit: pageLimit }
}


const getProjectById = async (projectId, tenantId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project Id", 400);
    }

    const project = await projectModel.findOne({
        _id: projectId,
        tenantId,

    })

    if (!project) {
        throw createError("Project not found", 404);
    }

    return project
}

const deleteProject = async (projectId, role, tenantId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project Id", 400);
    }

    if (role !== 'admin' && role !== "owner") {
        throw createError("Not authorized to delete project", 403);
    }

    const project = await projectModel.findOneAndDelete({
        _id: projectId,
        tenantId
    })

    if (!project) {
        throw createError("Project not found", 404);
    }

    await taskModel.deleteMany({ projectId });

    return project
}


const updateProject = async (projectId, tenantId, role, name, description, status) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project id", 400);
    }

    if (role !== 'admin' && role !== "owner") {
        throw createError("Not authorized to update", 403);
    }

    const updateData = {}

    if (name) updateData.name = name.trim()
    if (description) updateData.description = description.trim()
    if (status) updateData.status = status.trim()

    let project;
    try {
        project = await projectModel.findOneAndUpdate({
            _id: projectId,
            tenantId
        }, updateData, { new: true })
    } catch (error) {
        if (error.code === 11000) {
            throw createError("A project with this name already exists in your workspace", 400);
        }
        throw error;
    }


    if (!project) {
        throw createError("Project not found", 404);
    }

    return project

}

module.exports = { createProject, getAllProjects, getProjectById, deleteProject, updateProject }
