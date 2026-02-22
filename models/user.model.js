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
    }
},{timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User