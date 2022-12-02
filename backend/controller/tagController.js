var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection');
require('../models/tag');
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection');
var tagModel = mongoose.model('tag');


const tagController = {
    /**
     * find collection from tagId, remove task of taskID from alltask[]
     */
    deleteTask: async(tagId, taskID)=>{
        console.log(`!deleteTask tagId is ${tagId}. taskID is ${taskID}`); 

        let doc = await tagModel.updateOne(
            {"_id": tagId},
            { "$pull": {"allTasks": taskID}},
            { "new": true}
        )
        console.log(`after deleteTask doc: ${doc}`);
        return doc;
    },
 

    /**
     * update the pendingTasks[] by inserting one task 
     * @param tagId The collection ID that is the object to update
     * @param taskID The task ID that will be pushed to coll's allTasks[]
     */
    addTask: async (tagId, taskID) => {
        var taskIDObj = mongoose.Types.ObjectId(taskID); 
        console.log(`!addTask== tagId is ${tagId}. taskID is ${taskID}. taskIDObj is ${taskIDObj}`);

        let doc = await tagModel.findOneAndUpdate(
            {"_id": tagId},
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

module.exports = tagController;
