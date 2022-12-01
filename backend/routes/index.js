// root file of all routes
module.exports = function (app, router) {
    // Default route for testing.
    app.use("/api", require("./home.js")(router));

    // Add other routes here
    app.use('/api', require('./taskRoute.js')(router));
    // app.use("/api", require("./collectionRoute.js")(router));    
}

