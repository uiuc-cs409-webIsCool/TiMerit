const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const router = express.Router();
const secrets = require("./config/secrets.js");


const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});

// Set up middlewares
// public folder is used to store static resources for the root page
app.use("/", express.static(path.join(__dirname, "/public")));
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require("./routes")(app, router);

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);})