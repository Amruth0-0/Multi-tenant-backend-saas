const jwt = require("jsonwebtoken");
const WorkspaceMember = require("../models/workspaceMember.model");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const cookieToken = req.cookies?.token;

  let token = cookieToken;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Payload",
      });
    }

    let role = decoded.role;

    if (decoded.workspaceId) {
      const membership = await WorkspaceMember.findOne({
        userId: decoded.userId,
        workspaceId: decoded.workspaceId,
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are no longer a member of this workspace",
        });
      }
      role = membership.role;
    }

    req.user = {
      userId: decoded.userId,
      workspaceId: decoded.workspaceId,
      tenantId: decoded.tenantId,
      role: role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
