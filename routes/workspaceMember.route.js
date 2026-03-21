const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {getWorkspaceMembers, removeMember, updateMemberRole,} = require("../controllers/workspace.controller");
const {authRole } = require("../middleware/authRole"); 

const router = express.Router();

router.use(verifyToken);

// Get members
router.get("/:workspaceId/members", getWorkspaceMembers); 

// Remove member
router.delete("/:workspaceId/members/:memberId", authRole("owner","admin"), removeMember); 

// Update role
router.patch("/:workspaceId/members/:memberId/role",  authRole("owner","admin"), updateMemberRole);

module.exports = router;
