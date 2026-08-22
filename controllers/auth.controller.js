const jwt = require('jsonwebtoken')
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

    res.cookie("token", token, {
      httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === 'production'
    })

    res.status(201).json({
      success: true,
      token,
      username: req.body.username,
      redirectTo: "/create-workspace"
    })
  } catch (err) {
    res.status(err.status || 401).json({
      success: false,
      message: err.message || "Registration Failed"
    })
  }
}

const login = async (req, res) => {
  try {
    const result = await authSignin({
      email: req.body.email,
      password: req.body.password
    })

    res.cookie("token", result.token, {
      httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({
      success: true,
      token: result.token,
      userId: result.userId,
      username: result.username,
      workspaces: result.workspaces,
      redirectTo: result.workspaces.length > 0 ? "/dashboard" : "/create-workspace",
    });

  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Login Failed"
    })
  }
}

const selectWorkspace = async (req, res) => {
  try {
    const userId = req.user.userId
    const workspaceId = req.body.workspaceId

    const membership = await workspaceMember.findOne({
      userId: userId, workspaceId: workspaceId
    }).populate("workspaceId");

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const token = jwt.sign({
      userId: userId.toString(),
      tenantId: membership.workspaceId.tenantId,
      role: membership.role,
      workspaceId: membership.workspaceId._id.toString()
    }, process.env.JWT_SECRET,
      { expiresIn: "1d" })

    res.cookie("token", token, {
      httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({
      success: true,
      token,
      redirectTo: '/dashboard'
    })

  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Workspace selection failed",
    });
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie("token")

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })

  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Logout failed",
    });
  }
}


module.exports = { authRegister, login, selectWorkspace, logout }