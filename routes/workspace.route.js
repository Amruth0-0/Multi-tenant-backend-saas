const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");
const { authRole, authRoleForWorkspace } = require("../middleware/authRole");
const { workspaceCreate, getWorkspace, resetInviteLink } = require("../controllers/workspace.controller");
const { getInviteDetails, acceptInvite, } = require("../controllers/invite.controller");
const { workspaceValidator } = require("../validators/workspace.validator");
const { inviteMemberValidator, updateMemberRoleValidator } = require("../validators/member.validator")
const { acceptInviteValidator } = require("../validators/invite.validator")

// Public route to validate invite token
router.get("/invite/:token", getInviteDetails);

// Protected routes
router.use(verifyToken);

// Create workspace
router.post("/", workspaceValidator, workspaceCreate);

// Get workspace details (including inviteCode)
router.get("/:workspaceId", getWorkspace);

// Reset invite link
router.post("/:workspaceId/reset-invite", authRoleForWorkspace("owner"), resetInviteLink);

// Accept invite
router.post("/accept-invite", acceptInviteValidator, acceptInvite);

module.exports = router;
