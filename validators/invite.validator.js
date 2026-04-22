const { body, validationResult } = require("express-validator");

const acceptInviteValidator = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Invite token is required"),
  
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

module.exports = { acceptInviteValidator };
