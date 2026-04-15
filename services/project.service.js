const projectModel = require("../models/project.model")
const taskModel = require("../models/task.model")
const mongoose = require('mongoose')
const createError = require("../utils/createError")

const createProject = async (name, description, tenantId, createdBy) => {
    if (!name) {
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

const getAllProjects = async (tenantId) => {
    const projects = await projectModel.find({
        tenantId
    }).sort({ createdAt: -1 })

    return projects
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

    const project = await projectModel.findOneAndUpdate({
        _id: projectId,
        tenantId
    }, updateData, { new: true })


    if (!project) {
        throw createError("Project not found", 404);
    }

    return project

}

module.exports = { createProject, getAllProjects, getProjectById, deleteProject, updateProject }