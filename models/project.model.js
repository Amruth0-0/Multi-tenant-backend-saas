const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
     type: String,
     required: true
     
    },
    description: {
        type: String, 
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

projectSchema.index({name: 1, tenantID: 1}, {unique: true})

const project = mongoose.model('project', projectSchema)
module.exports = project