const debug = require("debug")("books:book_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

const index = async (req, res) => {
  const photos = await new models.Photo({ user: req.user.user_id }).fetchAll({
    // withRelated: ["user", "album"],
    withRelated: ["user"],
  });
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

module.exports = {
  index,
};
