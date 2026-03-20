const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Username is required")
    .bail() .isLength({ min: 4, max: 12 }) .withMessage("Username must be between 4 and 12 characters"),

  body("email") .notEmpty() .withMessage("Email is required") .bail() .isEmail() 
  .withMessage("Invalid email format") .normalizeEmail().trim(),

  body("password").notEmpty().withMessage("Password is required").trim()
    .bail() .isLength({ min: 8 }) .withMessage("Password must be at least 8 characters long"),

  validateRequest,
];

const loginValidator = [
  body("email") .notEmpty().withMessage("Email is required")  .bail()  .isEmail()
    .withMessage("Invalid email format"),

  body("password") .notEmpty()
    .withMessage("Password is required"),

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

module.exports = {
  registerValidator,
  loginValidator,
};