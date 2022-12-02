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
    var tagRoute = router.route('/tag');
    var tagRouteID = router.route('/tag/:id');

    //////////////////////////POST/////////////////////////
    tagRoute.post(async(req, res, next)=>{
        console.log('===in postTask===');
        console.log("req.body: "+JSON.stringify(req.body));
        const tag = new tagModel({
            name: req.body.name,
            description: req.body.description,
            tag: req.body.tag,
            duration: req.body.duration,
            date: req.body.date,
            assignedCollection: req.body.assignedCollection
        });
        console.log("! newtag: "+tag);
        tag.save().then(doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });
        }).catch((err)=>{
            next(err);
        })        
    });

    //////////////////////////PUT/////////////////////////
    tagRouteID.put(async(req, res, next)=>{
        console.log('===in putTag===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params.id));

        const id=req.params.id;
        const name = req.body.name? (req.body.name): null;
        var nameParam; if(name) nameParam=(name); console.log(nameParam);
 
        const doc = await tagModel.findOneAndUpdate(
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
    tagRoute.get(async (req, res) => {
        console.log('===in gettag===');

        const alltag=await tagModel.find();
        console.log("! get all tag: "+alltag);

        if(alltag) {
            res.status(200).json({
                message: "Status: Get Success",
                data: alltag
            });
        }
        else {
            next;
        }
    });


    //////////////////////////DELETE/////////////////////////
    tagRouteID.delete(async(req, res, next)=>{
        console.log('===in deletetag /:id===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let toDeletetagID = req.params.id;
        tagModel.findByIdAndDelete(toDeletetagID)
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
 