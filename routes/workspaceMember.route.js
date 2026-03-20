const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  getWorkspaceMembers,
  removeMember,
  updateMemberRole,
} = require("../controllers/workspace.controller");
const { authorizeRole, authRole } = require("../middleware/authRole"); 

const router = express.Router();

router.use(verifyToken);

// Get members
router.get("/members", getWorkspaceMembers); 

// Remove member
router.delete("/members/:memberId", authRole("admin"), removeMember); 

// Update role
router.patch(  "/members/:memberId/role",  authRole("admin"), updateMemberRole,
);

module.exports = router;
