const { body, validationResult } = require("express-validator");

const projectCreateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Project name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  validateRequest,
];

const projectUpdateValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Project name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .trim()
    .isIn(["active", "archived", "completed"])
    .withMessage("Invalid project status"),

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
  projectCreateValidator,
  projectUpdateValidator
};
