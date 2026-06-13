const { body } = require("express-validator");
const { validateRequest } = require("../utils/validateRequest");

const workspaceValidator = [
  body("name")    .trim()    .notEmpty()    .withMessage("Workspace name is required")
    .bail()  .isLength({ min: 3 })  .withMessage("Workspace name must be at least 3 characters"),

  validateRequest,
];

module.exports = { workspaceValidator };
