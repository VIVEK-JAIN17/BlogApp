var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
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

// INDEX : Displays All Entities, here, Blogs
app.get("/blogs", (req, res) => {
    Blog.find({})
        .then((blogs) => {
            res.render("index", { blogs: blogs });
        }).catch((err) => { console.log("ERROR", err) });
});

// NEW : Renders a Form to Create a new Entity, here, Blog
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE : Actually Creates a new Entity, here, Blog
app.post("/blogs", (req, res) => {
    var name = req.body.name;
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.body;
    var newBlog = { author: name, title: title, image: image, body: desc };
    Blog.create(newBlog)
        .then((blog) => {
            console.log("created a new Entity(blog)", blog);
            res.redirect('/blogs');
        }).catch((err) => { console.log(err) });
});
const host = 'localhost';
const port = 3000;

app.listen(port, host, () => {
    console.log(`Successfully connected to Express Server at ${host}:${port}`);
})

