var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection');
require('../models/tag');
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection');
var tagModel = mongoose.model('tag');

module.exports = (router) => {
    var taskRoute = router.route('/task');
    var taskRouteID = router.route('/task/:id');

    //////////////////////////POST/////////////////////////
    taskRoute.post(async(req, res, next)=>{
        console.log('===in postTask===');
        console.log("req.body: "+JSON.stringify(req.body));
        const task = new taskModel({
            name: req.body.name,
            description: req.body.description,
            tag: req.body.tag,
            duration: req.body.duration,
            date: req.body.date,
            assignedCollection: req.body.assignedCollection
        });
        console.log("! newTask: "+task);
        task.save().then(doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });
        }).catch((err)=>{
            next(err);
        })        
    });

    //////////////////////////////GET//////////////////////////////////
    taskRoute.get(async (req, res) => {
        console.log('===in getTask===');

        const alltask=await taskModel.find();
        console.log("! get all task: "+alltask);

        if(alltask)
        {
            res.status(200).json({
                message: "Status: Get Success",
                data: alltask
            });
        }
        else {
            next;
        }
    });


    //////////////////////////DELETE/////////////////////////
    taskRouteID.delete(async(req, res, next)=>{
        console.log('===in deleteTask /:id===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let toDeleteTaskID = req.params.id;
        taskModel.findByIdAndDelete(toDeleteTaskID)
            .then(result =>{
                console.log("! result: "+result);
                if(result)
                res.status(200).json({
                    message: "Status: Delete Success",
                    data: result
                });
            }).catch(next);     
    });


    return router;
}
 