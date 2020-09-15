const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const blogRouter = require('./routes/blogs');
const commentRouter = require('./routes/comments');

const app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

app.use("/blogs", blogRouter);
app.use("/blogs/:id/comments", commentRouter);

// APP/MONGOOSE CONFIG
const url = "mongodb://localhost:27017/blogApp";
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// RESTFUL ROUTES
app.get("/", (req, res) => {
    res.render("home");
});

connect.then(() => {
    console.log("Correctly Connected to MongoDB Server at " + url);
}).catch((err) => console.log(err));

const host = 'localhost';
const port = 3000;
app.listen(port, host, () => {
    console.log(`Successfully connected to Express Server at ${host}:${port}`);
});