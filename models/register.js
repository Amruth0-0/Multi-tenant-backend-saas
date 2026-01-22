const mongoose = require("mongoose")

const registerSchema = new mongoose.Schema({
    Workspace : {
        type: String,
        required : [true, "Workspace name required"],
        trim: true,
        unique: true

    },
    Username: {
        type: String,
        required : [true, "Username required"],
        trim: true,
        minLength: 4,
        maxLength: 12
        
    },
    Email: {
        type: String,
        required: [true, "Email required"], 
        trim: true,
        unique: true,
    },

    password:{
        type: String,
        required: [true, "Password required"],
        minLength : 5,
        maxLenght: 14,
        select: false

    }
})

const Register = mongoose.model("register", "registerSchema")
module.exports = Register