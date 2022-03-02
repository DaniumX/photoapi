/**
 * Book model
 */

module.exports = (bookshelf) => {
  return bookshelf.model("Photo", {
    tableName: "photos",
    user() {
      return this.belongsTo("User"); // books.author_id = 3   ->   authors.id = 3 (single author)
    },
    // albums() {
    // 	return this.belongsToMany('albums');
    // }
  });
};
