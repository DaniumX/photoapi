// Setting up the database connection
const knex = require("knex")({
  debug: true,
  client: "mysql",
  connection: process.env.CLEARDB_DATABASE_URL || {
    host: process.env.DB_HOST || "localhost",

    port: process.env.DB_PORT || 3306,

    user: process.env.DB_USER || "library",

    password: process.env.DB_PASSWORD || "",

    database: process.env.DB_NAME || "library",
  },
});

const bookshelf = require("bookshelf")(knex);

const models = {};
// models.Author = require('./Author')(bookshelf);
// models.Book = require('./Book')(bookshelf);
models.User = require("./User")(bookshelf);
models.Photo = require("./Photo")(bookshelf);
models.Album = require("./Album")(bookshelf);
models.PhotoAlbum = require("./PhotoAlbum")(bookshelf);

module.exports = {
  bookshelf,
  ...models,
};
