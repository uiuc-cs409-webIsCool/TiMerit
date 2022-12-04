var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection'); 
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection'); 


const taskController = {
    /**
     * given taskID, return its collID
     */
    getCollIDFromTaskID: async(taskID)=>{
        let doc= await taskModel.findOne({ '_id': taskID });
        console.log(`taskID: ${taskID}. found its collectionID: ${doc.assignedCollection}`);
        return doc.assignedCollection;
    },

    /**
     * given taskID, return its tagID
     */
    // getTagIDFromTaskID: async(taskID)=>{
    //     let doc= await taskModel.findOne({ '_id': taskID });
    //     console.log(`taskID: ${taskID}. found its tagId: ${doc.tag}`);
    //     return doc.tag;
    // },

    isTaskIDExist: async (taskId) =>{
        let doc = await taskModel.findOne(
            {"_id": taskId}
        )
        return doc ? true:false;
    },


}

module.exports = taskController;
