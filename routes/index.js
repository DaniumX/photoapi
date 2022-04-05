const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userValidationRules = require("../validation/user");
const photoValidationRules = require("../validation/photo");
const albumValidationRules = require("../validation/album");
const authController = require("../controllers/auth_controller");
const photoController = require("../controllers/photo_controller");
const albumController = require("../controllers/album_controller");

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post(
  "/register",
  userValidationRules.createRules,
  authController.register
);

router.get("/photos", auth.validateJwtToken, photoController.index);
router.get("/photos/:photoId", auth.validateJwtToken, photoController.show);
router.post(
  "/photos",
  auth.validateJwtToken,
  photoValidationRules.createRules,
  photoController.store
);
router.put(
  "/photos/:photoId",
  auth.validateJwtToken,
  photoValidationRules.updateRules,
  photoController.update
);

router.get("/albums", auth.validateJwtToken, albumController.index);
router.get("/albums/:albumId", auth.validateJwtToken, albumController.show);
router.post(
  "/albums",
  auth.validateJwtToken,
  albumValidationRules.createRules,
  albumController.store
);
//add photo to album
router.post(
  "/albums/:albumId/photos",
  auth.validateJwtToken,
  albumValidationRules.addRules,
  albumController.add
);
router.put(
  "/albums/:albumId",
  auth.validateJwtToken,
  albumValidationRules.updateRules,
  albumController.update
);

module.exports = router;
