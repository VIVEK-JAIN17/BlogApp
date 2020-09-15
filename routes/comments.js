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
                            res.redirect(`/blogs/${req.params.id}`);

                        }).catch((err) => { console.log(`Error while posting comment ${err}`); });

                }).catch((err) => { console.log(`Error while creating comment ${err}`); });

        }).catch((err) => { console.log(`Error while finding Blog ${err}`); });
});

router.get("/:commentId/edit", (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            Comment.findById(req.params.commentId)
                .then((comment) => {
                    res.render("comments/edit",
                        {
                            blog: blog,
                            comment: comment
                        });

                }).catch((err) => { console.log(err); });

        }).catch((err) => { console.log(err); });
});

router.put("/:commentId", (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment)
        .then((comment) => {
            console.log("Updated Comment !!");
            res.redirect(`/blogs/${req.params.id}`);

        }).catch((err) => { console.log(err); });
});

router.delete("/:commentId", (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId)
        .then(() => {
            console.log("comment Deleted Successfully !!");
            res.redirect(`/blogs/${req.params.id}`);

        }).catch((err) => { console.log(err); });
});

module.exports = router;
