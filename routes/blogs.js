const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

// INDEX : Displays All Entities, here, Blogs
router.get("/blogs", (req, res) => {
    Blog.find({})
        .then((blogs) => {
            res.render("blogs/index", { blogs: blogs });
        }).catch((err) => { console.log("ERROR", err) });
});

// NEW : Renders a Form to Create a new Entity, here, Blog
router.get("/blogs/new", (req, res) => {
    res.render("blogs/new");
});

// CREATE : Actually Creates a new Entity, here, Blog
router.post("/blogs", (req, res) => {
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
router.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("blogs/show", { blog: blog });
        }).catch((err) => { console.log("Error", err) });
});

// EDIT : Renders a form to gather info to Update an Entity, here, Blog
router.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("blogs/edit", { blog: blog });
        }).catch((err) => { console.log("Error", err) });
});

// UPDATE : Actually Updates an Existing Entity, here, Blog
router.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.newBlog)
        .then((blog) => {
            console.log("Blog Updated", blog);
            res.redirect("/blogs/" + req.params.id);
        }).catch((err) => { console.log("Error", err) });
});

// DELETE : Deletes an Entity from the database permanently, here, Blog
router.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
        .then((blog) => {
            console.log("Deleted Blog", blog);
            res.redirect("/blogs");
        }).catch((err) => { console.log("ERROR", err) });
});

module.exports = router;