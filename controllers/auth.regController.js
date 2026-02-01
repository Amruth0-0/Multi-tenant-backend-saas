const { authService } = require('../services/auth.service.reguser')

const authRegister = async(req, res) =>{
    try{
         const { token } = await authService({
            workspaceName: req.body.workspaceName,
            username: req.body,username,
            email: req.body.Email,
            password: req.body.password
         })  
         res.status(201).json({
            success: true,
            token,
            redirectTo : "/dashboard"
         })
    }catch(err){
       res.status(err.status || 500).json({
        success: false,
        message: err.message || "Registration Failed"
       })
    }
}

module.exports = authRegister