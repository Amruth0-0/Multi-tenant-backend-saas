const authService = require('../services/register.service')
const authSignin = require('../services/login.service')
const workspaceMember = require("../models/workspaceMember.model")

const authRegister = async (req, res) => {
  try {
    const { token } = await authService({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    res.status(201).json({
      success: true,
      token,
      redirectTo: "/create-workspace"
  })
  } catch (err) {
    res.status(err.status || 401).json({
      success: false,
      message: err.message || "Registration Failed"
    })
  }
}

const login = async(req,res)=>{
 try{
     const {userID, workspaces} = await authSignin({
      email: req.body.email,
      password: req.body.password
     })
     res.status(200).json({
        success: true,
        userID,
        workspaces
     })

 }catch(err){
     res.status(err.status || 500).json({
        success: false,
        message: err.message || "Login Failed"
     })
 }  
}

const selectWorkspace = async(req, res)=>{
   try{
      const {userId, workspaceId} = req.body

      const membership = await workspaceMember.find({
          user: userId, workspace: workspaceId
      }).populate("workspace");

      if(!membership){
          return res.status(403).json({
              sucess: false,
              message: "Access denied"
          });
      }

      const token = jwt.sign({
        userId,
        tenantId: membership.workspace.tenantId,
        role: membership.role
      },process.env.JWT_SECRET,
          {expiresIn: "1d"}
        );

      res.status(200).json({
        sucess: true,
        token,
        redirectTo: '/dashboard'
      })

   }catch(err){
       res.status(500).json({
           success: false,
           message: "Workspace selection failed"
       });
   }
}


module.exports = { authRegister, login, selectWorkspace}