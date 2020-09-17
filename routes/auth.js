const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const auth = require('../middlewares');
const router = express.Router();

// SIGNUP
router.route("/signup")
    .get((req, res) => {
        if (req.user) {
            req.flash("error", `Already logged in as ${req.user.username}`);
            console.log(`Already logged in as ${req.user.username}`);
            return res.redirect("back");
        }
        res.render("register");

    }).post((req, res) => {
        if (req.user) {
            req.flash("error", `Already logged in as ${req.user.username}`);
            console.log(`Already logged in as ${req.user.username}`);
            return res.redirect("back");
        }
        var newUser = new User({ username: req.body.username });
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                console.log("Error while signing up !!");
                return res.redirect("/signup");
            }
            passport.authenticate('local')(req, res, () => {
                req.flash("error", `User registered successfully !! Welcome ${user.username}`);
                console.log(`User registered successfully !! Welcome ${user.username}`);
                res.redirect("/blogs");

            });
        });
    });

router.route("/login")
    .get((req, res) => {
        if (req.user) {
            req.flash("error", `Already logged in as ${req.user.username}`);
            console.log(`Already logged in as ${req.user.username}`);
            return res.redirect("back");
        }
        res.render("login");

    }).post(passport.authenticate('local', {
        failureRedirect: "/login",
        failureFlash: true

    }), (req, res) => {
        req.flash("success", `User ${req.body.username} Logged in Successfully !!`);
        console.log(`User ${req.body.username} Logged in Successfully !!`);
        console.log("Session Started\n", req.session);
        return res.redirect("/blogs");

    });

router.get("/logout", auth.isLoggedin, (req, res) => {
    console.log(`Logging out user ${req.session.passport.user}`);
    req.session.destroy();
    res.clearCookie('session-id');
    // req.flash("success", "Logged out Scuccessfully !");
    console.log("Logged out Scuccessfully !");
    return res.redirect("/");
});

module.exports = router;
