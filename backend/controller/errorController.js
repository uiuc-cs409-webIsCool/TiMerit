module.exports = (err, req, res, next) => {
    try{
        console.log("ERROR MIDDLEWARE: " + err.message);
        res.status(500).send(err.message);
    }catch(err){
        res.status(500).send("Unknown error occurred.");
    }
}