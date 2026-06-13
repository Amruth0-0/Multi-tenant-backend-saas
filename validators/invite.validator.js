const { body } = require("express-validator");
const { validateRequest } = require("../utils/validateRequest");

const acceptInviteValidator = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Invite token is required"),
  
  validateRequest,
];

module.exports = { acceptInviteValidator };
