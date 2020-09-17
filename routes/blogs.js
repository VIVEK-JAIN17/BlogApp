const express = require('express');
const Blog = require('../models/blog');
const auth = require('../middlewares');
const router = express.Router();

// INDEX : Displays All Entities, here, Blogs
router.get("/", (req, res) => {
    Blog.find({})
        .then((blogs) => {
            res.render("blogs/index", { blogs: blogs });
        }).catch((err) => { console.log("ERROR", err) });
});

// NEW : Renders a Form to Create a new Entity, here, Blog
router.get("/new", auth.isLoggedin, (req, res) => {
    res.render("blogs/new");
});

// CREATE : Actually Creates a new Entity, here, Blog
router.post("/", auth.isLoggedin, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var newBlog = req.body.blog;
    Blog.create(newBlog)
        .then((blog) => {
            blog.author.id = req.user._id;
            blog.author.username = req.user.username
            blog.save()
                .then((blog) => {
                    console.log("created a new blog");
                    res.redirect('/blogs');
                }).catch((err) => { console.log(err); });
        }).catch((err) => { console.log(err) });
});

// SHOW : Displays details of a particular Entity, here, Blog
router.get("/:id", (req, res) => {
    Blog.findById(req.params.id).populate("comments")
        .then((blog) => {
            res.render("blogs/show", { blog: blog });
        }).catch((err) => { console.log("Error", err); });
});

// EDIT : Renders a form to gather info to Update an Entity, here, Blog
router.get("/:id/edit", auth.authBlog, (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("blogs/edit", { blog: blog });
        }).catch((err) => { console.log("Error", err) });
});

// UPDATE : Actually Updates an Existing Entity, here, Blog
router.put("/:id", auth.authBlog, (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.newBlog)
        .then((blog) => {
            req.flash("success", "Blog Updated");
            console.log("Blog Updated");
            res.redirect("/blogs/" + req.params.id);
        }).catch((err) => { console.log("Error", err) });
});

// DELETE : Deletes an Entity from the database permanently, here, Blog
router.delete("/:id", auth.authBlog, (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
        .then((blog) => {
            req.flash("success", "Deleted Blog");
            console.log("Deleted Blog");
            res.redirect("/blogs");
        }).catch((err) => { console.log("ERROR", err) });
});

module.exports = router;