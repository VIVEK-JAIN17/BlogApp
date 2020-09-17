const express = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const auth = require('../middlewares');
const router = express.Router({ mergeParams: true });

router.get("/new", auth.isLoggedin, (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            res.render("comments/new", { blog: blog });

        }).catch((err) => { console.log(err); });
});

router.post("/", auth.isLoggedin, (req, res) => {
    Blog.findById(req.params.id)
        .then((blog) => {
            Comment.create(req.body.comment)
                .then((comment) => {
                    console.log("comment created successfuly !");
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    return comment.save();

                }).then((comment) => {
                    blog.comments.push(comment);
                    return blog.save()

                }).then((blog) => {
                    console.log(`Comment posted successfully !`);
                    res.redirect(`/blogs/${req.params.id}`);

                }).catch((err) => { console.log(`Error while posting comment ${err}`); });

        }).catch((err) => { console.log(`Error while finding Blog ${err}`); });
});

router.get("/:commentId/edit", auth.authComment, (req, res) => {
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

router.put("/:commentId", auth.authComment, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment)
        .then((comment) => {
            req.flash("success", "Updated Comment !!");
            console.log("Updated Comment !!");
            res.redirect(`/blogs/${req.params.id}`);

        }).catch((err) => { console.log(err); });
});

router.delete("/:commentId", auth.authComment, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId)
        .then(() => {
            req.flash("success", "Your Comment was Deleted Successfully !!");
            console.log("comment Deleted Successfully !!");
            res.redirect(`/blogs/${req.params.id}`);

        }).catch((err) => { console.log(err); });
});

module.exports = router;
