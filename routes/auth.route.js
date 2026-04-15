const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");
const {
  authRegister,
  login,
  logout,
  selectWorkspace,
} = require("../controllers/auth.controller");
const router = express.Router();

//Register
router.post("/register", registerValidator, authRegister);

//Login
router.post("/login", loginValidator, login);

//Logout
router.post("/logout", logout);

//Select Workspace
router.post("/workspace/select", verifyToken, selectWorkspace);

module.exports = router;
