const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MONGOOSE/MODEL CONFIG
var blogSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
