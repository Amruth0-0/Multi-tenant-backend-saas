const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const {  inviteMember,  getWorkspaceMembers, removeMember,
     updateMemberRole} = require("../controllers/workspaceMember.controller")
const router = express.Router()


router.post("/workspace/:workspaceId/members", verifyToken, inviteMember)

router.get("/workspace/:workspaceId/members", verifyToken, getWorkspaceMembers)

router.delete("/workspace/members/:memberId", verifyToken, removeMember)

router.patch("/workspace/members/:memberId/role", verifyToken, updateMemberRole)

module.exports = router