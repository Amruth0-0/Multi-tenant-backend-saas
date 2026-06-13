const { body } = require("express-validator");
const { validateRequest } = require("../utils/validateRequest");
const mongoose = require("mongoose");

const taskCreateValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Task title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("createdBy")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid createdBy id");
      }
      return true;
    }),

  body("assignedTo")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid assignedTo id");
      }
      return true;
    }),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),

  validateRequest
];

const taskUpdateValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Task title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("assignedTo")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid assignedTo id");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Invalid task status"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),

  validateRequest
];

module.exports = {
  taskCreateValidator,
  taskUpdateValidator
};
