const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;

// public folder is used to store static resources
// app.use("/", express.static(path.join(__dirname, "/public")));

// app.use("/", );

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);})