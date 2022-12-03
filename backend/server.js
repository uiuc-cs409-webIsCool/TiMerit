const 
    bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    path = require("path"),
    router = express.Router(),
    secrets = require("./config/secrets.js"),
    cors = require("cors"),
    errorController = require('./controller/errorController');


const app = express();
const PORT = process.env.PORT || 8080;


// const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});

// Set up middlewares
// public folder is used to store static resources for the root page
app.use("/", express.static(path.join(__dirname, "/public")));
// Allow application recieve json data
app.use(express.json());
// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

require("./routes")(app, router);

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);})

app.use(errorController);