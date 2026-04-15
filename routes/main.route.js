const express = require("express");
const router = express.Router();

//Home Page
router.get("/", (req, res) => {
  res.render("index");
});

//Login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//Register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

//Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard/dashboard");
});

//Create Workspace
router.get("/create-workspace", (req, res) => {
  res.render("workspace/create-workspace");
});

//Invite page
router.get("/invite/:token", (req, res) => {
  res.render("workspace/accept-invite", {
    token: req.params.token,
  });
});

//Projects List
router.get("/projects", (req, res) => {
  res.render("projects/projects", { projects: [] });
});

//Create Project Page
router.get("/projects/create", (req, res) => {
  res.render("projects/create-project");
});

//Single Project View  
router.get("/projects/:projectId", (req, res) => {
  res.render("projects/project-view", {
    project: null,
    tasks: [],
    projectId: req.params.projectId
  });
});

//Create Task Page
router.get("/tasks/create", (req, res) => {
  const projectId = req.query.projectId || "";
  res.render("tasks/create-task", { projectId, members: [] });
});

//Task Detail Page
router.get("/tasks/:taskId", (req, res) => {
  res.render("tasks/task-detail", {
    task: null,
    members: [],
    taskId: req.params.taskId
  });
});

//Workspace Members Page
router.get("/workspace/members", (req, res) => {
  res.render("workspace/members", { members: [] });
});

//Invite Member Page
router.get("/workspace/members/invite", (req, res) => {
  res.render("workspace/invite-member");
});

module.exports = router;
