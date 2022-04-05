const debug = require("debug")("photos:photo_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

const index = async (req, res) => {
  const photos = await new models.Photo({ user: req.user.user_id })
    .where("user", req.user.user_id)
    .fetchAll();
  let data = photos.map((photo) => {
    return {
      id: photo.get("id"),
      title: photo.get("title"),
      url: photo.get("url"),
      comment: photo.get("comment"),
    };
  });

  res.send({
    status: "success",
    data,
  });
};

const show = async (req, res) => {
  let photo;
  try {
    photo = await new models.Photo({
      id: req.params.photoId,
      user: req.user.user_id,
    }).fetch();
  } catch (e) {
    return res
      .status(404)
      .send({ status: "fail", data: "No such image found" });
  }

  res.send({
    status: "success",
    data: {
      id: photo.get("id"),
      title: photo.get("title"),
      url: photo.get("url"),
      comment: photo.get("comment"),
    },
  });
};

const store = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);
  validData.user = req.user.user_id;

  try {
    const photo = await new models.Photo(validData).save();
    debug("Created new photo successfully: %O", photo);

    res.send({
      status: "success",
      data: {
        title: photo.get("title"),
        url: photo.get("url"),
        comment: photo.get("comment"),
        user_id: photo.get("user"),
        id: photo.get("id"),
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when creating a new photo.",
    });
    throw error;
  }
};

const update = async (req, res) => {
  const photoId = req.params.photoId;

  const photo = await new models.Photo({
    id: photoId,
    user: req.user.user_id,
  }).fetch({ require: false });
  if (!photo) {
    debug("Photo to update was not found. %o", { id: photoId });
    res.status(404).send({
      status: "fail",
      data: "Photo Not Found",
    });
    return;
  }

  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  try {
    const updatedPhoto = await photo.save(validData);
    debug("Updated Photo successfully: %O", updatedPhoto);

    res.send({
      status: "success",
      data: {
        title: photo.get("title"),
        url: photo.get("url"),
        comment: photo.get("comment"),
        user_id: photo.get("user"),
        id: photo.get("id"),
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when updating a new photo.",
    });
    throw error;
  }
};

module.exports = {
  index,
  show,
  store,
  update,
};
