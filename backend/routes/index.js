// root file of all routes
module.exports = function (app, router) {
    // Default route for testing.
    app.use("/api", require("./home.js")(router));
    // Add other routes here

    
}
