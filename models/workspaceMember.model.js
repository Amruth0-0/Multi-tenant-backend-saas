const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    role: {
        type: String,
        enum: ["owner","admin","member"],
        required: true
    }
},{timestamps: true})

memberSchema.index({ user: 1, workspace: 1 }, { unique: true })

const WorkspaceMember = mongoose.model('WorkspaceMember',memberSchema)
module.exports = WorkspaceMember