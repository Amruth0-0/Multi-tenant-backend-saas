const { body, validationResult } = require("express-validator");

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