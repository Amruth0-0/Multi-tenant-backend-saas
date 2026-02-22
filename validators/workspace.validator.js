const { body, validationResult } = require("express-validator");

const workspaceValidator = [
  body("name")    .trim()    .notEmpty()    .withMessage("Workspace name is required")
    .bail()  .isLength({ min: 3 })  .withMessage("Workspace name must be at least 3 characters"),

  validateRequest,
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
}

module.exports = { workspaceValidator };