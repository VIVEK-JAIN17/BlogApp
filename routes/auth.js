const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// SIGNUP
router.route("/signup")
    .get((req, res) => {
        res.render("register");

    }).post((req, res) => {
        var newUser = new User({ username: req.body.username });
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                console.log("Error while signing up !!");
                return res.redirect("/signup");
            }
            passport.authenticate('local')(req, res, () => {
                console.log(`User registered successfully !! Welcome ${user.username}`);
                res.redirect("/blogs");

            });
        });
    });

router.route("/login")
    .get((req, res) => {
        res.render("login");

    }).post(passport.authenticate('local', {
        failureRedirect: "/login"

    }), (req, res) => {
        console.log(`User ${req.body.username} Logged in Successfully !!`);
        console.log("Session Started\n", req.session);
        return res.redirect("/blogs");

    });

router.get("/logout", (req, res) => {
    console.log(`Logging out user ${req.session.passport.user}`);
    req.session.destroy();
    res.clearCookie('session-id');
    console.log("Logged out Scuccessfully !");
    return res.redirect("/");
});

module.exports = router;
