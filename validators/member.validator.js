const { body } = require("express-validator");
const { validateRequest } = require("../utils/validateRequest");

const inviteMemberValidator = [
  body("email")
    .notEmpty()
    .withMessage("User email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),

  validateRequest,
];


const updateMemberRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),
  validateRequest,
];

module.exports = { inviteMemberValidator, updateMemberRoleValidator };
