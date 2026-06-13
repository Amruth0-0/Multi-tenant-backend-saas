const express = require("express");
const router = express.Router();

const { requireAuthUI }          = require("../middleware/requireAuthUI");
const { redirectIfAuthenticated } = require("../middleware/redirectIfAuthenticated");
const {
  renderHome,
  renderLogin,
  renderRegister,
  renderAcceptInvite,
  renderDashboard,
  renderCreateWorkspace,
  renderInviteMember,
  renderMembers,
  renderProjects,
  renderCreateProject,
  renderProjectView,
  renderCreateTask,
  renderTaskDetail,
} = require("../controllers/ui.controller");

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get("/",              renderHome);
router.get("/login",         redirectIfAuthenticated, renderLogin);
router.get("/register",      redirectIfAuthenticated, renderRegister);
router.get("/invite/:token", renderAcceptInvite);

// ─── Protected Routes (require valid session cookie) ──────────────────────────
router.use(requireAuthUI);

router.get("/dashboard",             renderDashboard);
router.get("/create-workspace",      renderCreateWorkspace);
router.get("/workspace/members",     renderMembers);
router.get("/workspace/invite-member", renderInviteMember);

router.get("/projects",           renderProjects);
router.get("/projects/create",    renderCreateProject);
router.get("/projects/:projectId", renderProjectView);

router.get("/tasks/create",       renderCreateTask);
router.get("/tasks/:taskId",      renderTaskDetail);

module.exports = router;
