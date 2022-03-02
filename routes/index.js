const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userValidationRules = require("../validation/user");
const authController = require("../controllers/auth_controller");
const photoController = require("../controllers/photo_controller");

router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

// register a new user
router.post(
  "/register",
  userValidationRules.createRules,
  authController.register
);

router.get("/photos", auth.validateJwtToken, photoController.index);

module.exports = router;
