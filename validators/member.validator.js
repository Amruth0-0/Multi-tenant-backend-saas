const { body, param, validationResult } = require("express-validator");

const inviteMemberValidator = [
  param("workspaceId")
    .notEmpty()
    .withMessage("Workspace ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid workspace ID"),

  body("email")
    .notEmpty()
    .withMessage("User email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .isIn(["OWNER", "ADMIN", "MEMBER"])
    .withMessage("Role must be OWNER, ADMIN, or MEMBER"),

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

module.exports = { inviteMemberValidator };