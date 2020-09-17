const Blog = require('../models/blog');
const Comment = require('../models/comment');

exports.isLoggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You are Not Logged In !!");
    res.redirect("/login");
}

exports.authBlog = (req, res, next) => {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id)
            .then((blog) => {
                if (blog.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "you do not have permission to do that !!");
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        req.flash("error", "you are not logged in !!");
        res.redirect("back");
    }
}

exports.authComment = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId)
            .then((comment) => {
                if (comment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "you do not have permission to do that !!");
                    res.redirect("back");
                }
            }).catch((err) => { console.log(err); });
    } else {
        req.flash("error", "you are not logged in !!");
        res.redirect("back");
    }
}