var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection');
require('../models/tag');
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection');
var tagModel = mongoose.model('tag');


const collectionController = {
    /**
     * find collection from collID, remove task of taskID from alltask[]
     */
    deleteTask: async(collID, taskID)=>{
        console.log(`! collID is ${collID}. taskID is ${taskID}`); 

        let doc = await collectionModel.updateOne(
            {"_id": collID},
            { "$pull": {"allTasks": taskID}},
            { "new": true}
        )
        console.log(`after deleteTask doc: ${doc}`);
        return doc;
    },
 

    /**
     * update the pendingTasks[] by inserting one task 
     * @param collectionId The collection ID that is the object to update
     * @param taskID The task ID that will be pushed to coll's allTasks[]
     */
     addTask: async (collectionId, taskID) => {
        var taskIDObj = mongoose.Types.ObjectId(taskID); 
        console.log(`! collectionId is ${collectionId}. taskID is ${taskID}. taskIDObj is ${taskIDObj}`);

        let doc = await collectionModel.findOneAndUpdate(
            {"_id": collectionId},
            {"$addToSet": {"allTasks": taskIDObj}},
            {"new": true}
        )
        console.log(`! after addTask doc: ${doc}`);
        return doc;
    },

    isIDExist: async (id) =>{
        let doc = await tagModel.findOne(
            {"_id": id}
        )
        return doc ? true:false;
    },
}

module.exports = collectionController;
