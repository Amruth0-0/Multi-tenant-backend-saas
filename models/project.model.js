const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
     type: String,
     required: true,
     trim: true
     
    },
    description: {
        type: String, 
        default: ""
    },

    tenantId: {
       type: String,
       required: true,
       index: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'archived', 'completed']
    }
}, {timestamps: true})

projectSchema.index({name: 1, tenantId: 1}, {unique: true})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project