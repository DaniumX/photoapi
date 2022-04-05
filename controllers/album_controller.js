const debug = require("debug")("album:album_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

const index = async (req, res) => {
  const albums = await new models.Album({ user: req.user.user_id })
    .where("user", req.user.user_id)
    .fetchAll();
  let data = albums.map((album) => {
    return {
      id: album.get("id"),
      title: album.get("title"),
      user_id: album.get("user"),
    };
  });

  res.send({
    status: "success",
    data,
  });
};

const show = async (req, res) => {
  let album;
  try {
    album = await new models.Album({
      id: req.params.albumId,
      user: req.user.user_id,
    }).fetch();
  } catch (e) {
    return res
      .status(404)
      .send({ status: "fail", data: "No such album found" });
  }

  let photos;
  try {
    photos = await models.PhotoAlbum.forge()
      .where("album", "=", req.params.albumId)
      .fetchAll({
        withRelated: ["photo"],
      });
  } catch (error) {}
  console.log(photos.length);

  let photosFormatted = photos.map((photo) => {
    // console.log(photo.related("photo"));
    return {
      id: photo.related("photo").get("id"),
      title: photo.related("photo").get("title"),
      url: photo.related("photo").get("url"),
      comment: photo.related("photo").get("comment"),
      user_id: photo.related("photo").get("user"),
    };
  });

  res.send({
    status: "success",
    data: {
      id: album.get("id"),
      title: album.get("title"),
      photos: photosFormatted,
    },
  });
};

const store = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  const validData = matchedData(req);
  validData.user = req.user.user_id;

  try {
    const album = await new models.Album(validData).save();
    debug("Created new album successfully: %O", album);

    res.send({
      status: "success",
      data: {
        album,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when creating a new album.",
    });
    throw error;
  }
};

const add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  let album;
  try {
    album = await new models.Album({
      id: req.params.albumId,
      user: req.user.user_id,
    }).fetch();
  } catch (e) {
    return res
      .status(404)
      .send({ status: "fail", data: "No such album found" });
  }

  const validData = matchedData(req);
  validData.user = req.user.user_id;

  console.log(req.params.albumId, validData.photo_id);

  album = await new models.PhotoAlbum({
    album: req.params.albumId,
    photo: validData.photo_id,
  }).fetch({ require: false });

  if (album) {
    return res
      .status(404)
      .send({ status: "fail", data: "Photo already in album" });
  }

  try {
    const PhotoAlbum = await new models.PhotoAlbum({
      album: req.params.albumId,
      photo: validData.photo_id,
    }).save();
    debug("Created new photo successfully: %O", PhotoAlbum);

    res.send({
      status: "success",
      data: null,
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
  const albumId = req.params.albumId;

  let album;
  try {
    album = await new models.Album({
      id: req.params.albumId,
      user: req.user.user_id,
    }).fetch();
  } catch (e) {
    return res
      .status(404)
      .send({ status: "fail", data: "No such album found" });
  }

  album = await new models.Album({ id: albumId }).fetch({
    require: false,
  });
  if (!album) {
    debug("Book to update was not found. %o", { id: albumid });
    res.status(404).send({
      status: "fail",
      data: "Album Not Found",
    });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  const validData = matchedData(req);
  delete validData.albumId;

  try {
    const updatedAlbum = await album.save(validData);
    debug("Updated book successfully: %O", updatedAlbum);

    res.send({
      status: "success",
      data: {
        album,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when updating a new book.",
    });
    throw error;
  }
};

module.exports = {
  index,
  show,
  add,
  store,
  update,
};
