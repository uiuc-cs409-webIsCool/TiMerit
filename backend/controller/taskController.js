var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

require('../models/collection');
require('../models/tag');
require('../models/task');
var taskModel = mongoose.model('task');
var collectionModel = mongoose.model('collection');
var tagModel = mongoose.model('tag');


const taskController = {
    /**
     * given taskID, return its collID
     */
    getCollIDFromTaskID: async(taskID)=>{
        let doc= await taskModel.findOne({ '_id': taskID });
        console.log(`taskID: ${taskID}. found its collectionID: ${doc.assignedCollection}`);
        return doc.assignedCollection;
    },
}

module.exports = taskController;
