const mongoose = require('mongoose')
const {v4 : uuid} = require('uuid')

const workspaceModel = new mongoose.Schema({
    tenantId: {
        type: String,
        default: () => uuid(),
        unique: true,
        required: true,
        immutable: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        default: 'active',
        enum: ["active", "suspended", "deleted"]
    }
},{timestamps: true})

workspaceModel.index({ name: 1, ownerId: 1 }, { unique: true })
const Workspace = mongoose.model("Workspace", workspaceModel)
module.exports = Workspace