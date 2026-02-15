const mongoose = require('mongoose')
const {v4 : uuid} = require('uuid')

const workspaceModel = new mongoose.Schema({
    tenantID: {
        type: String,
        default: () => uuid(),
        unique: true,
        immutable: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status:{
        type: String,
        default: 'Active',
        enum: ["Active", "Suspended", "Deleted"]
    }
},{timestamps: true})

const Workspace = mongoose.model("Workspace", workspaceModel)
module.exports = Workspace