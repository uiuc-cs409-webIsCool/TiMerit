const { application } = require('express');
var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.post('/signup',(req,res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        res.status(400).send({
            message:'No inf provided', 
            data: []
        });
    } 
    User.findOne({email: req.body.email})
    .then((user) => {
        if (!user) {
            User.create({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password
            })
            .then((users_res) => {
                res.status(201).send({
                    message:"User created",
                    data:users_res
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message:err.message,
                    data:[]
                })
            });    
        } else {
            res.status(400).send({
                message:"User already exists",
                data:[]
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            message:err.message,
            data:[]
        })
    })    
});

router.post('/login',(req,res) => {
    User.findOne({email: req.body.email})
    .then((user) => {
        if (!user) {
            res.status(400).send({
                message:'User does not exist', 
                data: []
            });
        }
        if (req.body.password != user.password) {
            res.status(400).send({
                message:'Password is not correct', 
                data: []
            });
        } else {
            res.status(200).send({
                message:'Login success', 
                data: []
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            message:err.message,
            data:[]
        })
    })  
})

module.exports = router;