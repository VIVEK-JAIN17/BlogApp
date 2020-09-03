var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');

var app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// APP/MONGOOSE CONFIG
const url = "mongodb://localhost:27017/blogApp";
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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
var Blog = mongoose.model('Blog', blogSchema);

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
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("==============");
    console.log(req.body);
    var newBlog = req.body.blog;
    Blog.create(newBlog)
        .then((blog) => {
            console.log("created a new Entity(blog)", blog);
            res.redirect('/blogs');
        }).catch((err) => { console.log(err) });
});

// SHOW : Displays details of a particular Entity, here, Blog
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("show", { blog: blog });
        }).catch((err) => { console.log("Error", err) });
});

// EDIT : Renders a form to gather info to Update an Entity, here, Blog
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("edit", { blog: blog });
        }).catch((err) => { console.log("Error", err) });
});

// UPDATE : Actually Updates an Existing Entity, here, Blog
app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.newBlog)
        .then((blog) => {
            console.log("Blog Updated", blog);
            res.redirect("/blogs/" + req.params.id);
        }).catch((err) => { console.log("Error", err) });
});

// DELETE : Deletes an Entity from the database permanently, here, Blog
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
        .then((blog) => {
            console.log("Deleted Blog", blog);
            res.redirect("/blogs");
        }).catch((err) => { console.log("ERROR", err) });
});

const host = 'localhost';
const port = 3000;

app.listen(port, host, () => {
    console.log(`Successfully connected to Express Server at ${host}:${port}`);
})

