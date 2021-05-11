/**
 * Express HTTP Server
 */

const express = require("express");
const path = require("path");
const app = express();

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/", require("./router"));

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
