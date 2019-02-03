const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String,
    age: Number
});

// We make a model or a collection in the database
//and it will have objects that looks like this schema that we just made
module.exports = mongoose.model('Author', authorSchema);