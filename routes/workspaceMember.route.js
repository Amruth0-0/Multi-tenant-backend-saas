const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { getWorkspaceMembers, removeMember, updateMemberRole } = require("../controllers/workspace.controller");
const { authRoleForWorkspace } = require("../middleware/authRole"); 
const { updateMemberRoleValidator } = require("../validators/member.validator");

const router = express.Router();

router.use(verifyToken);

// Get members
router.get("/:workspaceId/members", getWorkspaceMembers); 

// Remove member
router.delete("/:workspaceId/members/:memberId", authRoleForWorkspace("owner", "admin"), removeMember); 

// Update role
router.patch("/:workspaceId/members/:memberId/role", authRoleForWorkspace("owner", "admin"), updateMemberRoleValidator, updateMemberRole);

module.exports = router;
