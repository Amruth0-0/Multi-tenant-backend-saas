const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const Workspace = require('../models/workspace.model')
const jwt = require('jsonwebtoken')

const authService = async ({workspaceName, username, email, password})=>{
    //Check email
    const isEmail = await User.exists({email})
    if(isEmail){
        res.status(409).json({
            success: false,
            message: "Email already exists"
        })
    }

    //Create workspace
    const workspace = await Workspace.create({
        name: workspaceName
    })
    
    //Hash password
    const hashpass = await bcrypt.hash(password, 10)

    //Create user as owner
    const user = await User.create({
         username,
         email,
         password: hashpass,
         workspaceId: workspace._id,
         role: 'owner'
    })
     
   //Link workspace owner
   workspace.ownerID = user._id
   await workspace.save()

   //Create jwt token
   const token = jwt.sign({
    userId: user._id,
    workspaceId: workspace._id,
    role: user.role
   },process.env.JWT_SECRET,
   {expiresIn: '1d'}
)
  return {token}
}

module.exports = authService
