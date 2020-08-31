var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extedned: true }));

// APP/MONGOOSE CONFIG
const url = "mongodb://localhost:27017/blogApp";
const connect = mongoose.connect(url, { useNewUrlParser: true });
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
    author: {
        type: String,
        required: true
    },
}, { timestamps: true });
var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     image: "http://via.placeholder.com/300",
//     title: "Fisrt Blog",
//     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum blanditiis quae iusto! Laudantium ab, soluta temporaodio amet commodi temporibus!",
//     author: "Test Author"
// });

// RESTFUL ROUTES
app.get("/", (req, res) => {
    res.render("home");
});

// INDEX : Displays All Entities, here Blogs
app.get("/blogs", (req, res) => {
    Blog.find({})
        .then((blogs) => {
            res.render("index", { blogs: blogs });
        }).catch((err) => { console.log("ERROR", err) });
});

const host = 'localhost';
const port = 3000;

app.listen(port, host, () => {
    console.log(`Successfully connected to Express Server at ${host}:${port}`);
})

