const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");
const { authorizeRole } = require("../middleware/authorizeRole");
const { workspaceCreate } = require("../controllers/workspace.controller");
const {
  createInvite,
  getInviteDetails,
  acceptInvite,
} = require("../controllers/invite.controller");
const { workspaceValidator } = require("../validators/workspace.validator");

// Public route to validate invite token
router.get("/invite/:token", getInviteDetails);

// Protected routes
router.use(verifyToken);

// Create workspace
router.post("/", workspaceValidator, workspaceCreate);

// Create invite
router.post("/invite", authorizeRole("admin"), createInvite);

// Accept invite
router.post("/accept-invite", acceptInvite);

module.exports = router;
