/**
 * ui.controller.js
 * Handles all EJS view rendering for UI routes.
 * Route files should only import and reference these handlers — zero logic in routes.
 */

exports.renderHome = (req, res) => res.render("index");

exports.renderLogin    = (req, res) => res.render("auth/login");
exports.renderRegister = (req, res) => res.render("auth/register");

exports.renderAcceptInvite = (req, res) =>
  res.render("workspace/accept-invite", { token: req.params.token });

exports.renderDashboard       = (req, res) => res.render("dashboard/dashboard");
exports.renderCreateWorkspace = (req, res) => res.render("workspace/create-workspace");
exports.renderInviteMember = (req, res) => res.render("workspace/invite-member");
exports.renderMembers = (req, res) => res.render("workspace/members", { members: [] });

exports.renderProjects      = (req, res) => res.render("projects/projects", { projects: [] });
exports.renderCreateProject = (req, res) => res.render("projects/create-project");
exports.renderProjectView   = (req, res) =>
  res.render("projects/project-view", {
    project:   null,
    tasks:     [],
    projectId: req.params.projectId,
  });

exports.renderCreateTask = (req, res) =>
  res.render("tasks/create-task", {
    projectId: req.query.projectId || "",
    members:   [],
  });

exports.renderTaskDetail = (req, res) =>
  res.render("tasks/task-detail", {
    task:   null,
    members: [],
    taskId: req.params.taskId,
  });
