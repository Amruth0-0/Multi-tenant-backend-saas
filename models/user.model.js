const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : [true, "Username required"],
        trim: true,
        minLength: 4,
        maxLength: 12
        
    },
    email: {
        type: String,
        required: [true, "Email required"], 
        lowercase: true,
        unique: true,
        index: true
    },
    password:{
        type: String,
        required: [true, "Password required"],
        minLength : 8,
        select: false
    },
    workspaceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['owner','admin','member'],
        default: 'member'
    }

},{timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User