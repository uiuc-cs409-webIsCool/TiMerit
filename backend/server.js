const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// public folder is used to store static resources
// app.use("/", express.static(path.join(__dirname, "/public")));

// app.use("/", );

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);})