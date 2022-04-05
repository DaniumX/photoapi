/**
 * Book model
 */

module.exports = (bookshelf) => {
  return bookshelf.model("PhotoAlbum", {
    tableName: "photos_albums",
    photo() {
      return this.belongsTo("Photo", "photo"); // books.author_id = 3   ->   authors.id = 3 (single author)
    },
  });
};
