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