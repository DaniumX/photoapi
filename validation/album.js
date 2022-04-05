const { body, param } = require("express-validator");
const models = require("../models");

const addRules = [
  body("photo_id")
    .exists()
    .custom(async (value) => {
      const photo = await new models.Photo({ id: value }).fetch({
        require: false,
      });
      if (!photo) {
        return Promise.reject(`Photo with ID ${value} does not exist.`);
      }

      return Promise.resolve();
    }),
];

const createRules = [body("title").exists().isLength({ min: 3 })];

/**
 * Update User validation rules
 *
 * Required: -
 * Optional: password, first_name, last_name
 */
// @TODO id check
const updateRules = [
  param("albumId").exists(),
  body("title").optional().isLength({ min: 3 }),
];

module.exports = {
  addRules,
  createRules,
  updateRules,
};
