const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
});
// We make a model or a collection in the database
//and it will have objects that looks like this schema that we just made which is bookSchema
module.exports = mongoose.model('Book', bookSchema);