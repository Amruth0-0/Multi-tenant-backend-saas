const authService = require('../services/register.service')
const authSignin = require('../services/login.service')

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
     const {token} = await authSignin({
      email: req.body.email,
      password: req.body.password
     })
     res.status(200).json({
        success: true,
        token,
        redirectTo: "/dashboard"
     })

 }catch(err){
     res.status(err.status || 500).json({
        success: false,
        message: err.message || "Login Failed"
     })
 }  
}

module.exports = { authRegister, login }