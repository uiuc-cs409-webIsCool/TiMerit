const { application } = require('express');
var express = require('express');
var User = require('../models/user');
var router = express.Router();
var jwt = require("jsonwebtoken");

router.post('/signup', async(req, res) => {
    /**
     * Check every input is better to put at frontend button's handler function. (I am not sure)
     * TODO: Frontend should give user immediate feedback if they are empty.
     * */

    // if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
    //     res.status(400).send({
    //         message:'No inf provided', 
    //         data: []
    //     });
    // } 

    const user = new User({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const data = await user.save();
        res.status(201).json({message:"Successfully created a user", data: data});
    } catch (err) {
        res.status(500).json({message: err.message})
    }

    /**
     * It seems no need to check duplicated email here. Because in User model the email
     * field is defined as unique. It will automatically throw an error if it't not.
     * TODO: It should also give user feedback at frontend if their input email exists.
     */

    // User.findOne({email: req.body.email})
    // .then((user) => {
    //     if (!user) {
    //         User.create({
    //             firstname:req.body.firstname,
    //             lastname:req.body.lastname,
    //             email:req.body.email,
    //             password:req.body.password
    //         })
    //         .then((users_res) => {
    //             res.status(201).send({
    //                 message:"User created",
    //                 data:users_res
    //             })
    //         })
    //         .catch((err) => {
    //             res.status(500).send({
    //                 message:err.message,
    //                 data:[]
    //             })
    //         });    
    //     } else {
    //         res.status(400).send({
    //             message:"User already exists",
    //             data:[]
    //         });
    //     }
    // })
    // .catch((err) => {
    //     res.status(500).send({
    //         message:err.message,
    //         data:[]
    //     })
    // })    
});


router.post('/login', async(req, res) => {
    const user = await User.findOne(req.body);

    if (user) {
        // return the encrypted email
        const token = jwt.sign({
            email: req.body.email
        }, "shhhhh");

        res.json({
            status: "ok",
            user: token
        })
    } else {
        res.json({
            status: "error",
            user: false
        })
    }
    // User.findOne({email: req.body.email})
    // .then((user) => {
    //     if (!user) {
    //         res.status(400).send({
    //             message:'User does not exist', 
    //             data: []
    //         });
    //     }
    //     if (req.body.password != user.password) {
    //         res.status(400).send({
    //             message:'Password is not correct', 
    //             data: []
    //         });
    //     } else {
    //         res.status(200).send({
    //             message:'Login success', 
    //             data: []
    //         });
    //     }
    // })
    // .catch((err) => {
    //     res.status(500).send({
    //         message:err.message,
    //         data:[]
    //     })
    // })  
})

router.get("/login", async(req, res) => {
    const token = req.headers["x-access-token"];
    try {
        const decoded = jwt.verify(token, "shhhhh");
        const email = decoded.email;
    } catch (err) {
        res.status(400).send({
            message: "Invalid token",
            error: err.message
        });
    }
})

module.exports = router;