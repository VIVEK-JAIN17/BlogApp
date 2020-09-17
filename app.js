// Express
const express = require('express');
const app = express();

// Other
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const flash = require('connect-flash');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// Routes
const blogRouter = require('./routes/blogs');
const commentRouter = require('./routes/comments');
const authRouter = require('./routes/auth');

// MONGOOSE CONFIG
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/blogApp";
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// GLOBAL MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

// PASSPORT CONFIG
app.use(require('express-session')({
    name: "session-id",
    secret: "12345-BlogApp-54321",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// LANDING ROUTE
app.get("/", (req, res) => {
    res.render("home");
});

// ROUTES CONFIG
app.use("/", authRouter);
app.use("/blogs", blogRouter);
app.use("/blogs/:id/comments", commentRouter);

connect.then(() => {
    console.log("Correctly Connected to MongoDB Server at " + url);
}).catch((err) => console.log(err));

const host = 'localhost';
const port = 3000;
app.listen(port, host, () => {
    console.log(`Successfully connected to Express Server at ${host}:${port}`);
});