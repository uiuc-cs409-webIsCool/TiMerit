var jwt = require("jsonwebtoken");

var express = require('express'),
    router = express.Router(),
    collectionController = require('../controller/collectionController'),
    mongoose = require('mongoose');

require('../models/collection'); 
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection'); 

module.exports = (router) => {
    var collectionRoute = router.route('/collection');
    var collectionRouteID = router.route('/collection/:id');

    //////////////////////////POST/////////////////////////
    collectionRoute.post(async(req, res, next)=>{
        console.log('===in postCollection===');
        console.log("req.body: "+JSON.stringify(req.body));
        // Decode token with key shhhhh
        const decoded = jwt.verify(req.headers['x-access-token'], "shhhhh");

        const collection = new collectionModel({
            name: req.body.name,
            allTasks: req.body.allTasks,
            assignedUser: decoded.email
        });

        console.log("! newCollection: "+collection); 
        collection.save().then(doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });
        }).catch(next)        
    });

    //////////////////////////PUT/////////////////////////
    collectionRouteID.put(async(req, res, next)=>{
        console.log('===in putcollection===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params.id));


        const id=req.params.id;
        if( !(await collectionController.isIDExist(id)) ){
            let err = new Error('Status: PUT Collection Failed. Given collection ID not found');
            err.code = 404;
            next(err); 
            return;
        }

        const name = req.body.name? (req.body.name): null;
        var nameParam; if(name) nameParam=(name); console.log(nameParam);
 
        const doc = await collectionModel.findOneAndUpdate(
            { _id: id },
            { name: nameParam }, 
            { new: true }
        ).catch(next);
        console.log("! after update: "+JSON.stringify(doc)); 
        
        if(doc){
            res.status(201).json({
                message: "Status: Update Success",
                data: doc
            });
        }      
    });



    //////////////////////////////GET//////////////////////////////////
    collectionRoute.get(async (req, res) => {
        console.log(req.headers["x-access-token"])
        const decoded = jwt.verify(req.headers['x-access-token'], "shhhhh");
        console.log('===in getCollection===');

        const allCollection=await collectionModel.find({"assignedUser": decoded.email});
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

    //////////////////////////////GET:id//////////////////////////////////
    collectionRouteID.get(async (req, res) => {
        console.log('===in get:id Collection===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let id = req.params.id;
        const foundColl=await collectionModel.findOne({ '_id': id }) 

        if(foundColl) {
            res.status(200).json({
                message: "Status: Get Success",
                data: foundColl
            });
        }
        else {
            let err = new Error('Status: Locate Collection Failed. Given collection ID not found');
            err.code = 404;
            next(err); 
            return;
        }
    });


    //////////////////////////DELETE/////////////////////////
    collectionRouteID.delete(async(req, res, next)=>{
        console.log('===in deleteCollection /:id===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let toDeleteCollID = req.params.id;
        if( !(await collectionController.isIDExist(toDeleteCollID)) ){
            let err = new Error('Status: DELETE Collection Failed. Given collection ID not found');
            err.code = 404;
            next(err); 
            return;
        }

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