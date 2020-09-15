const express = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const router = express.Router({ mergeParams: true });

router.get("/new", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("comments/new", { blog: blog });

        }).catch((err) => { console.log(err); });
});

router.post("/", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            Comment.create(req.body.comment)
                .then((comment) => {
                    console.log("comment created successfuly !");
                    blog.comments.push(comment);
                    blog.save()
                        .then(() => {
                            console.log(`Comment posted successfully !`);
                            res.redirect("/blogs/" + req.params.id);

                        }).catch((err) => { console.log(`Error while posting comment ${err}`); });

                }).catch((err) => { console.log(`Error while creating comment ${err}`); });

        }).catch((err) => { console.log(`Error while finding Blog ${err}`); });
});

router.get("/edit", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("comments/new", { blog: blog });

        }).catch((err) => { console.log(err); });
});

module.exports = router;
