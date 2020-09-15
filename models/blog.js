const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MONGOOSE/MODEL CONFIG
const blogSchema = new Schema({
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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
