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
    var collectionRoute = router.route('/collection');
    var collectionRouteID = router.route('/collection/:id');

    //////////////////////////POST/////////////////////////
    collectionRoute.post(async(req, res, next)=>{
        console.log('===in postCollection===');
        console.log("req.body: "+JSON.stringify(req.body));
        const collection = new collectionModel({
            name: req.body.name,
            allTasks: req.body.allTasks
        });
        console.log("! newCollection: "+collection); 
        collection.save().then(doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });
        }).catch(next)        
    });

    //////////////////////////////GET//////////////////////////////////
    collectionRoute.get(async (req, res) => {
        console.log('===in getCollection===');

        const allCollection=await collectionModel.find();
        console.log("! get all collection: "+allCollection);

        if(allCollection) {
            res.status(200).json({
                message: "Status: Get Success",
                data: allCollection
            });
        }
        else {
            next;
        }
    });

    //////////////////////////DELETE/////////////////////////
    collectionRouteID.delete(async(req, res, next)=>{
        console.log('===in deleteCollection /:id===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let toDeleteCollID = req.params.id;
        collectionModel.findByIdAndDelete(toDeleteCollID)
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