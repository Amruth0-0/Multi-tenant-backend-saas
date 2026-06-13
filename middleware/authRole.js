const WorkspaceMember = require("../models/workspaceMember.model");

exports.authRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};

exports.authRoleForWorkspace = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const workspaceId = req.params.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: "Workspace ID required",
        });
      }

      const membership = await WorkspaceMember.findOne({
        userId: req.user.userId,
        workspaceId: workspaceId,
      });

      if (!membership || !allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      req.user.role = membership.role;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};
