const task = require('../models/task');

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    taskController = require('../controller/taskController'),
    tagController = require('../controller/tagController'),
    collectionController = require('../controller/collectionController'),
    toId = mongoose.Types.ObjectId;

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
        task.save().then(async doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });

            //after task created, add taskID to given collectionID
            await collectionController.addTask(req.body.assignedCollection, doc._id);

            //after task created, add taskID to given tagID
            await tagController.addTask(req.body.tag, doc._id);
        }).catch((err)=>{
            next(err);
        })    
    });

    //////////////////////////PUT/////////////////////////
    taskRouteID.put(async(req, res, next)=>{
        console.log('===in putTask===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params.id));


        const id=req.params.id;
        const name = req.body.name? (req.body.name): null;
        var nameParam; if(name) nameParam=(name); console.log(nameParam);
        
        const tag = req.body.tag? (req.body.tag): null;
        var tagParam; var oldTagId;
        if(tag) {
            tagParam=(tag); 
            console.log(tagParam);
            
            oldTagId = await taskController.getTagIDFromTaskID(id);
        }
        const description = req.body.description? (req.body.description): null;
        var descriptionParam; if(description) descriptionParam=toId(description); console.log(descriptionParam);

        const assignedCollection = req.body.assignedCollection? (req.body.assignedCollection): null;
        var assignedCollectionParam; if(assignedCollection) assignedCollectionParam=toId(assignedCollection); console.log(assignedCollectionParam);

 
        const doc = await taskModel.findOneAndUpdate(
            { _id: id },
            { 
                name: nameParam,
                tag: tagParam,
                description: descriptionParam,
                assignedCollection: assignedCollectionParam
            }, 
            { new: true }
        ).catch(next);
        console.log("! after update: "+(doc)); 
        
        if(doc){
            res.status(201).json({
                message: "Status: Update Success",
                data: doc
            });

            if(tagParam){
                //after task created, add taskID to given new tagID
                await tagController.addTask(req.body.tag, doc._id);

                //goto old tagID, delete taskID from alltask[]
                await tagController.deleteTask(oldTagId, doc._id);
            }
        }  
        else{
            let err = new Error('Status: Update Failed');
            err.code = 404;
            next(err); 
        };    
    });

    //////////////////////////////GET//////////////////////////////////
    taskRoute.get(async (req, res) => {
        console.log('===in getTask===');

        const alltask=await taskModel.find();
        console.log("! get all task: "+alltask);

        if(alltask) {
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
        
        //1 find todelete task CollID + save taskID
        let toDeleteTaskID = req.params.id;
        if( !(await taskController.isTaskIDExist(toDeleteTaskID)) ){
            let err = new Error('Status: Delete Task Failed. Given task ID not found');
            err.code = 404;
            next(err); 
            return;
        }
        let collectionId = await taskController.getCollIDFromTaskID(toDeleteTaskID);
        let tagId = await taskController.getTagIDFromTaskID(toDeleteTaskID);

        //2 delete a task
        taskModel.findByIdAndDelete(toDeleteTaskID)
            .then(result =>{
                console.log("! result: "+result);
                if(result)
                res.status(200).json({
                    message: "Status: Delete Success",
                    data: result
                });
            }).catch(next);   
            
        //3 goto CollID, delete taskID from alltask[]
        await collectionController.deleteTask(collectionId, toDeleteTaskID);

        //4 goto tagID, delete taskID from alltask[]
        await tagController.deleteTask(tagId, toDeleteTaskID);
    });


    return router;
}
 