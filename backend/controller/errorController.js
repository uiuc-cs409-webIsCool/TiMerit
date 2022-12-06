module.exports = (err, req, res, next) => {
    try{
        console.log("ERROR MIDDLEWARE: " + err.message);
        if(err.code === undefined)
            res.status(500).send(err.message);
        else{
            let code = err.code;
            res.status(code).send(err.message);
        }
    }catch(err){
        res.status(500).send("Unknown error occurred.");
    }
}