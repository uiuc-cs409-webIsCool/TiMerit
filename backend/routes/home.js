module.exports = function(router) {
    var homeRoute = router.route("/");
    homeRoute.get(function(req, res) {
        res.json({message: "It's API default route."});
    })

    return router;
}