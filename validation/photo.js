const { body, param } = require("express-validator");

const createRules = [
  body("title").exists().isLength({ min: 3 }),
  body("url").exists().isURL(),
  body("comment").exists().isLength({ min: 3 }),
];

/**
 * Update User validation rules
 *
 * Required: -
 * Optional: password, first_name, last_name
 */
// @TODO id check
const updateRules = [
  //   param("id").exists(),
  body("title").optional().isLength({ min: 3 }),
  body("url").optional().isURL(),
  body("comment").optional().isLength({ min: 3 }),
];

module.exports = {
  createRules,
  updateRules,
};
