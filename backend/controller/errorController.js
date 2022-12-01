module.exports = (err, req, res, next) => {
    try{
        console.log("ERROR MIDDLEWARE: " + err.code);
    }catch(err){
        res.status(500).send("Unknown error occurred.");
    }
}