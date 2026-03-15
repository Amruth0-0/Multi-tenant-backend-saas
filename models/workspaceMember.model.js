const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    role: {
        type: String,
        enum: ["owner","admin","member"],
        required: true
    },
},{timestamps: true})

memberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true })

const WorkspaceMember = mongoose.model('WorkspaceMember',memberSchema)
module.exports = WorkspaceMember