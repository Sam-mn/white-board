/**
 * Express HTTP Server
 */

const express = require("express");

const app = express();

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", require("./router"));

module.exports = app;
