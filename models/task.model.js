const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
     title : {
        type: String,
        required: true
     },
     description: {
         type: String,
         default: ""
     },

     projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
     },
    
    tenantId: {
        type: String,
        required: true
    },

    createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
     },
     
    status: {
        type: String,
        enum: ['todo','in_progress','completed'],
        default: 'todo'
    },

     assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    dueDate: {
        type: Date
    }

},{ timestamps: true})

taskSchema.index({ projectId: 1, tenantId: 1 })

const Task = mongoose.model('Task', taskSchema)
module.exports = Task