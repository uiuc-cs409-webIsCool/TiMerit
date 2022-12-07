const task = require('../models/task');

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    taskController = require('../controller/taskController'), 
    collectionController = require('../controller/collectionController'),
    toId = mongoose.Types.ObjectId;

require('../models/collection'); 
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection'); 

module.exports = (router) => {
    var taskRoute = router.route('/task');
    var taskRouteID = router.route('/task/:id');

    //////////////////////////POST/////////////////////////
    taskRoute.post(async(req, res, next)=>{
        console.log('===in postTask===');
        console.log("req.body: "+JSON.stringify(req.body));

        //if not given assignedCollection, assign Uncategorized to it
        var uncategorizedCollection_id = req.body.assignedCollection;
        if(!uncategorizedCollection_id){
            uncategorizedCollection_id = await collectionController.getUncategorizedId();
        }
        console.log("! uncategorizedCollection_id: "+uncategorizedCollection_id);

        const task = new taskModel({
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed,
            // tag: req.body.tag,
            duration: req.body.duration,
            date: req.body.date,
            assignedCollection: uncategorizedCollection_id,
            assignedUser: req.body.assignedUser
        });
        console.log("! newTask: "+task);
        task.save().then(async doc =>{
            res.status(201).json({
                message: "Status: Create Success",
                data: doc
            });

            //after task created, add taskID to given collectionID
            let collID = req.body.assignedCollection ? req.body.assignedCollection: uncategorizedCollection_id;
            await collectionController.addTask(collID, doc._id);

            //after task created, add taskID to given tagID
            // await tagController.addTask(req.body.tag, doc._id);


        }).catch((err)=>{
            next(err);
        })    
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

    //////////////////////////////GET:id//////////////////////////////////
    taskRouteID.get(async (req, res, next) => {
        console.log('===in get:idTask===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        let id = req.params.id;
        const foundTask=await taskModel.findOne({ '_id': id })
            // .then(result =>{
            //     console.log("! get task: "+foundTask);
            //     if(result)
            //     res.status(200).json({
            //         message: "Status: Delete Success",
            //         data: result
            //     });
            // }).catch((err)=>{
            //     err.message = "404 Cannot locate task based on id: " + id;
            //     next(err);
            // });  

        if(foundTask) {
            res.status(200).json({
                message: "Status: Get Success",
                data: foundTask
            });
        }
        else {
            let err = new Error('Status: Locate Task Failed. Given task ID not found');
            err.code = 404;
            next(err); 
            return;
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
        // let tagId = await taskController.getTagIDFromTaskID(toDeleteTaskID);

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
        // await tagController.deleteTask(tagId, toDeleteTaskID);
    });
    //////////////////////////UPDATE/////////////////////////
    taskRouteID.put(async(req, res, next)=>{
        console.log('===in putTask /:id===');
        console.log("! req.body: "+JSON.stringify(req.body));
        console.log("! req.params: "+JSON.stringify(req.params));
        
        //1 find update task CollID + save taskID
        let toUpdateTaskID = req.params.id;
        if( !(await taskController.isTaskIDExist(toUpdateTaskID)) ){
            let err = new Error('Status: Delete Task Failed. Given task ID not found');
            err.code = 404;
            next(err); 
            return;
        }
        //2 update a task
        taskModel.findByIdAndUpdate(toUpdateTaskID,req.body, {
            new: true,
          })
            .then(result =>{
                console.log("result: "+result);
                if(result)
                res.status(200).json({
                    message: "Status: update Success",
                    data: result
                });
            }).catch(next);   
    });


    return router;
}
 